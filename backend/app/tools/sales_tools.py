from langchain_core.tools import tool
from app.core.database import SessionLocal
from app.models.interaction import HCPInteraction
import datetime

# 1. MANDATORY TOOL: Log Interaction
@tool
def log_interaction(hcp_name: str, discussion_topic: str, summary: str, next_steps: str) -> str:
    """Logs a new sales interaction with a Healthcare Professional into the CRM database."""
    db = SessionLocal()
    try:
        interaction = HCPInteraction(
            hcp_name=hcp_name,
            discussion_topic=discussion_topic,
            summary=summary,
            next_steps=next_steps
        )
        db.add(interaction)
        db.commit()
        db.refresh(interaction)
        return f"Successfully logged interaction ID {interaction.id} for Dr. {hcp_name} into the SQL database."
    except Exception as e:
        db.rollback()
        return f"Error logging interaction: {str(e)}"
    finally:
        db.close()

# 2. MANDATORY TOOL: Edit Interaction
@tool
def edit_interaction(interaction_id: int, updated_summary: str) -> str:
    """Edits or updates an existing interaction summary based on its database ID."""
    db = SessionLocal()
    try:
        interaction = db.query(HCPInteraction).filter(HCPInteraction.id == interaction_id).first()
        if interaction:
            interaction.summary = updated_summary
            db.commit()
            return f"Successfully updated interaction ID {interaction_id} in the database."
        return f"Interaction with ID {interaction_id} not found."
    except Exception as e:
        db.rollback()
        return f"Error updating interaction: {str(e)}"
    finally:
        db.close()

# 3. CUSTOM TOOL: Schedule Follow-Up
@tool
def schedule_follow_up(hcp_name: str, timeframe: str, context: str) -> str:
    """Schedules a calendar reminder or follow-up window for an HCP sales activity."""
    return f"Action item created: Follow up with Dr. {hcp_name} in '{timeframe}' regarding '{context}'."

# 4. CUSTOM TOOL: Fetch HCP Profile
@tool
def fetch_hcp_profile(hcp_name: str) -> str:
    """Retrieves institutional affiliation, specialization info, and preferences for an HCP."""
    return f"Profile for Dr. {hcp_name}: Specializes in Oncology/Cardiology at City General Hospital. Prefers quick clinical data breakdowns."

# 5. CUSTOM TOOL: Search Product Literature
@tool
def search_product_literature(drug_name: str) -> str:
    """Searches medical brochures, clinical data packets, and efficacy stats for a given drug or treatment."""
    return f"Fetched core facts for {drug_name}: Displays an 84% positive tolerance rate in Phase III clinical trials. Documentation linked."

# Export list of tools for LangGraph
tools = [log_interaction, edit_interaction, schedule_follow_up, fetch_hcp_profile, search_product_literature]