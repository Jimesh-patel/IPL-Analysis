from sqlalchemy import create_engine
from langchain_community.utilities import SQLDatabase
from sqlalchemy.engine import URL
from langchain_google_genai import GoogleGenerativeAI
import os

from langchain.agents import initialize_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.agents import AgentType
from dotenv import load_dotenv
load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not set in environment variables.")

llm = GoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=GOOGLE_API_KEY)

url = URL.create(
    drivername="postgresql+psycopg2",
    username=os.getenv("DB_USER", "postgres"),
    password=os.getenv("DB_PASS", "root123"),
    host=os.getenv("DB_HOST", "localhost"),
    port=os.getenv("DB_PORT", 5432),
    database=os.getenv("DB_NAME", "IPL_DATA"),
)

engine = create_engine(url)
db = SQLDatabase(engine, include_tables=["matches_data", "deliveries_data", "team_data"])

toolkit = SQLDatabaseToolkit(db=db, llm=llm)

agent_executor = initialize_agent(
    tools=toolkit.get_tools(),
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

def generate_answer(question: str) -> str:
    try:
        response = agent_executor.run(question)
        if isinstance(response, str):
            return response
        else:
            return str(response)
    except Exception as e:
        return f"Error generating answer: {e}"