import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.prebuilt import ToolNode
from langchain_core.messages import SystemMessage, HumanMessage
from tools import tools

# --- ENV LOADING ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(BASE_DIR, '.env')
load_dotenv(dotenv_path=ENV_PATH)

API_key = os.getenv("GROQ_API_KEY")

# We use Llama-3.3-70b as it has superior tool-calling capabilities on Groq
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0,
    api_key=os.getenv("API_key")
)

llm_with_tools = llm.bind_tools(tools)

# Node 1: The AI Agent
def agent_node(state: MessagesState):
    messages = state["messages"]
    if not any(isinstance(m, SystemMessage) for m in messages):
        sys_msg = SystemMessage(content=(
            "You are an AI assistant for a Life Sciences CRM. "
            "Help the field representative log interactions with Healthcare Professionals (HCPs). "
            "Extract entities and call the `log_interaction` tool when you have enough info. "
            "If they ask for materials, use `retrieve_materials`."
            "Your memory contains previous conversational turns, but you MUST prioritize the user's LATEST message."

            "CRITICAL RULES FOR EDITING (edit_interaction): "
            "1. ONLY update a field if the user EXPLICITLY corrects it (e.g., 'Change the name to Dr. Y'). "
            "2. NEVER change the 'hcp_name' if the user simply refers to 'the doctor', 'the doc', 'he', 'she', or 'they'. Treat those as pronouns referring to the already established name. "
            "3. If a user updates one specific detail (e.g., 'the sentiment was actually negative'), ONLY call the tool for that exact field. Do not guess or overwrite other fields."
            "4. NEVER repeat or summarize old tool outputs (like suggested follow-ups or sentiment analysis) unless the user specifically asks for them again."
            "5. If the user introduces a NEW meeting or a NEW doctor, you MUST immediately trigger the `log_interaction` tool for that new doctor."
            "6. Treat each new doctor mentioned as a completely separate context."
        
        ))
        messages = [sys_msg] + messages
    
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}

# Node 2: Tool Execution
tool_node = ToolNode(tools)

# Build the Graph
workflow = StateGraph(MessagesState)
workflow.add_node("agent", agent_node)
workflow.add_node("tools", tool_node)

workflow.add_edge(START, "agent")
# If the agent decides to use a tool, go to 'tools', otherwise END
workflow.add_conditional_edges("agent", lambda state: "tools" if state["messages"][-1].tool_calls else END)
workflow.add_edge("tools", "agent")

graph = workflow.compile()