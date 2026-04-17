from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from agent import graph
from langchain_core.messages import HumanMessage, AIMessage

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    chat_history: list = [] 

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # 1. Load History so the AI remembers previous context
        messages = []
        for msg in request.chat_history:
            if msg.get('role') == 'user':
                messages.append(HumanMessage(content=msg.get('content')))
            elif msg.get('role') == 'ai':
                messages.append(AIMessage(content=msg.get('content')))
        
        # 2. Add the current prompt
        messages.append(HumanMessage(content=request.message))
        
        # 3. Invoke Agent
        result = graph.invoke({"messages": messages})
        ai_message = result["messages"][-1].content
        
        extracted_data = {}
        for msg in result["messages"]:
            if hasattr(msg, 'tool_calls') and msg.tool_calls:
                for call in msg.tool_calls:
                    if call['name'] == 'log_interaction':
                        extracted_data.update(call['args'])
                    elif call['name'] == 'edit_interaction':
                        field = call['args'].get('field_to_update')
                        val = call['args'].get('new_value')
                        if field and val:
                            extracted_data[field] = val 

        frontend_data = {}
        mapping = {
            'hcp_name': 'hcpName', 'hcpName': 'hcpName',
            'interaction_type': 'interactionType', 'interactionType': 'interactionType',
            'topics_discussed': 'topicsDiscussed', 'topicsDiscussed': 'topicsDiscussed',
            'sentiment': 'sentiment',
            'materials_shared': 'materialsShared', 'materialsShared': 'materialsShared',
            'samples_distributed': 'samplesDistributed', 'samplesDistributed': 'samplesDistributed'
        }
        
        for key, value in extracted_data.items():
            mapped_key = mapping.get(key)
            if mapped_key:
                frontend_data[mapped_key] = value

        return {
            "reply": ai_message,
            "extractedEntities": frontend_data
        }
        
    except Exception as e:
        # THIS PREVENTS THE SERVER FROM CRASHING
        print(f"Server Crash Prevented: {str(e)}")
        return {
            "reply": f"I hit an internal error processing that request: {str(e)}",
            "extractedEntities": {}
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)