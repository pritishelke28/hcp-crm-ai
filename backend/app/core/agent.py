import os
from langchain_groq import ChatGroq
from langgraph.prebuilt import create_react_agent
from app.tools.sales_tools import tools
from dotenv import load_dotenv

# Force loading directly from your absolute .env path on the F drive
load_dotenv(dotenv_path="F:/hcp-crm-ai/backend/.env")

groq_key = os.getenv("GROQ_API_KEY")

# Safety check to make sure the key is actively loaded
if not groq_key:
    raise ValueError("GROQ_API_KEY is missing! Double-check your .env file at F:\\hcp-crm-ai\\backend\\.env")

# Initialize the Groq LLM with the requested model name
llm = ChatGroq(
    temperature=0, 
    model_name="gemma2-9b-it", 
    groq_api_key=groq_key
)

# System prompt giving context for a Life Science Medical Sales Assistant
system_prompt = (
    "You are an AI assistant designed for life science field sales representatives. "
    "Your job is to manage interactions with Healthcare Professionals (HCPs). "
    "Use your tools to log interactions, update summaries, fetch profiles, schedule tasks, or look up drug data. "
    "When a user provides conversational notes, use the log_interaction tool by extracting the fields cleanly."
)

# CHANGED: Using 'prompt' instead of 'state_modifier' to match your local package version
agent_executor = create_react_agent(llm, tools, prompt=system_prompt)