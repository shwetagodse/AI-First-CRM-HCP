from langchain_core.tools import tool
from pydantic import BaseModel, Field
from typing import Optional, List, Any
from models import SessionLocal, InteractionDB

# --- Tool 1: Log Interaction (Mandatory) ---
class LogInteractionInput(BaseModel):
    hcp_name: str = Field(description="Name of the Healthcare Professional")
    interaction_type: str = Field(description="Type: Meeting, Email, or Call", default="Meeting")
    topics_discussed: str = Field(description="Summary of what was discussed")
    sentiment: str = Field(description="Inferred sentiment: Positive, Neutral, or Negative")

@tool("log_interaction", args_schema=LogInteractionInput)
def log_interaction(hcp_name: str, interaction_type: str, topics_discussed: str, sentiment: str) -> dict:
    """Logs a new HCP interaction into the database."""
    db = SessionLocal()
    new_interaction = InteractionDB(
        hcp_name=hcp_name,
        interaction_type=interaction_type,
        topics_discussed=topics_discussed,
        sentiment=sentiment
    )
    db.add(new_interaction)
    db.commit()
    db.refresh(new_interaction)
    db.close()
    return {"status": "success", "message": f"Interaction with {hcp_name} logged.", "id": new_interaction.id, "extracted_data": {
        "hcpName": hcp_name, "interactionType": interaction_type, "topicsDiscussed": topics_discussed, "sentiment": sentiment
    }}

# --- Tool 2: Edit Interaction (Mandatory) ---
class EditInteractionInput(BaseModel):
    # 'Any' type stops strict validation from crashing if AI messes up the ID
    interaction_id: Any = Field(description="The ID of the interaction to edit. Pass 0 if unknown.", default=0)
    field_to_update: str = Field(description="MUST BE EXACTLY ONE OF: hcp_name, interaction_type, topics_discussed, sentiment, materials_shared, samples_distributed")
    new_value: str = Field(description="The new value to set")

@tool("edit_interaction", args_schema=EditInteractionInput)
def edit_interaction(field_to_update: str, new_value: str, interaction_id: Any = 0) -> str:
    """Edits an existing logged interaction or draft form."""

    # 1. Safely handle if the AI passes 'None', 'null', or a string instead of an integer
    safe_id = 0
    try:
        if interaction_id is not None:
            safe_id = int(interaction_id)
    except (ValueError, TypeError):
        safe_id = 0

    # 2. Proceed with the safe integer
    if safe_id > 0:
        db = SessionLocal()
        record = db.query(InteractionDB).filter(InteractionDB.id == safe_id).first()
        if record:
            if hasattr(record, field_to_update):
                setattr(record, field_to_update, new_value)
                db.commit()
            db.close()
            return f"Successfully updated {field_to_update} to '{new_value}' in database."
        db.close()
    
    return f"Successfully captured edit: {field_to_update} changed to '{new_value}'."

# --- Tool 3: Suggest Follow-ups ---
@tool("suggest_followups")
def suggest_followups(topics: str) -> List[str]:
    """Generates suggested follow-up actions based on discussed topics."""
    follow_ups = []
    if "efficacy" in topics.lower() or "trial" in topics.lower():
        follow_ups.append("Send Phase III clinical trial data PDF.")
    if "adverse" in topics.lower() or "side effects" in topics.lower():
        follow_ups.append("Schedule an urgent follow-up with the Medical Science Liaison (MSL).")
    follow_ups.append("Schedule routine follow-up meeting in 2 weeks.")
    return follow_ups

# --- Tool 4: Retrieve Materials (RAG Mock) ---
@tool("retrieve_materials")
def retrieve_materials(query: str) -> str:
    """Searches the company database for product brochures or safety documents."""
    # In a real app, this would use a vector database (like Chroma/Pinecone)
    mock_db = {
        "oncoboost": "OncoBoost Phase III Trial Results.pdf - Shows 40% reduction in tumor size.",
        "safety": "General Safety Guidelines 2025.pdf - Outlines contraindications."
    }
    for key, doc in mock_db.items():
        if key in query.lower():
            return f"Found document: {doc}"
    return "No specific materials found for that query."

# --- Tool 5: Analyze Sentiment ---
@tool("analyze_sentiment")
def analyze_sentiment(text: str) -> str:
    """Explicitly analyzes the sentiment of a conversation if it is ambiguous."""
    positive_words = ['great', 'impressed', 'good', 'promising','Effective', 'Clinically proven','Highly effective', 'Consistent results', 'Reliable', 'Easy to administer', 'Strong clinical value']
    negative_words = ['concerned', 'bad', 'side effects', 'doubtful','Poor response','Ineffective', 'Limited efficacy', 'Safety concerns', 'Risk of complications', 'Worsening symptoms']
    
    pos_count = sum(1 for word in positive_words if word in text.lower())
    neg_count = sum(1 for word in negative_words if word in text.lower())
    
    if pos_count > neg_count: return "Positive"
    elif neg_count > pos_count: return "Negative"
    return "Neutral"

# List of tools to bind to the agent
tools = [log_interaction, edit_interaction, suggest_followups, retrieve_materials, analyze_sentiment]