# Flask SQL Server (Natural Language to SQL API)

This Flask server provides a RESTful API that allows users to ask natural language questions about IPL cricket data, which are then translated into SQL queries and executed on a PostgreSQL database. The backend uses Google Gemini (via LangChain) for language understanding and SQLAlchemy for database access.

---

## Features

- Accepts natural language questions and returns answers from the IPL database.
- Uses Google Gemini LLM for question understanding.
- Supports CORS for cross-origin requests.
- Easy integration with frontend applications.

---

## Requirements

- Python 3.8+
- PostgreSQL database with IPL data
- Google Gemini API key

Install dependencies:

```sh
pip install -r requirements.txt
```

---

## Environment Variables

Create a `.env` file in the `src/` directory with the following content:

```env
GOOGLE_API_KEY="your-google-api-key"
DB_USER="your-db-username"
DB_PASS="your-db-password"
DB_HOST="localhost"
DB_PORT=5432
DB_NAME="IPL_DATA"
```

---

## Running the Server

From the `src/` directory, run:

```sh
python Flask-server/app.py
```

The server will start on `http://localhost:5001/`.

---

## API Endpoints

### 1. Test Endpoint

**GET** `/test`

_Response:_
```json
{ "message": "Welcome to the SQL API. Use the /ask endpoint to ask questions." }
```

---

### 2. Ask a Question

**POST** `/ask`

_Request Body:_
```json
{ "question": "Which team won the most matches in 2020?" }
```

_Response:_
```json
{
  "question": "Which team won the most matches in 2020?",
  "answer": "Mumbai Indians won the most matches in 2020."
}
```

---

## Notes

- The `/ask` endpoint expects a JSON body with a `question` field.
- Ensure your PostgreSQL database is running and accessible.
- The server uses environment variables for sensitive information.
- CORS is enabled by default.

---

## Example cURL

```sh
curl -X POST http://localhost:5001/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Show all players who scored more than 500 runs in 2019."}'
```