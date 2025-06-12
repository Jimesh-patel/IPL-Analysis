# Flask SQL API

This project is a Flask-based API that allows users to ask questions, which are then converted into SQL queries and executed against a PostgreSQL database. The results are returned in a human-readable format.

## Project Structure

```
flask-sql-api
├── src
│   ├── app.py          # Entry point of the Flask application
│   ├── db.py           # Database connection and query execution
│   ├── llm.py          # Logic for interacting with the language model
│   └── utils.py        # Utility functions for the application
├── requirements.txt     # Project dependencies
└── README.md            # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd flask-sql-api
   ```

2. **Create a virtual environment:**
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Ensure you have the necessary environment variables set for your database connection and any API keys required for the language model.

## Usage

1. **Run the Flask application:**
   ```
   python src/app.py
   ```

2. **API Endpoint:**
   - **POST /ask**
     - **Request Body:**
       ```json
       {
         "question": "Your question here"
       }
       ```
     - **Response:**
       ```json
       {
         "answer": "The answer to your question"
       }
       ```

## Example

To ask a question, you can use a tool like `curl` or Postman:

```bash
curl -X POST http://localhost:5000/ask -H "Content-Type: application/json" -d '{"question": "What is the total number of matches won by CSK?"}'
```

## License

This project is licensed under the MIT License.