from flask import Flask, request, jsonify
from llm import generate_answer

app = Flask(__name__)

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Welcome to the SQL API. Use the /ask endpoint to ask questions."})

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    question = data.get('question')
    if not question:
        return jsonify({"error": "Question is required"}), 400
    result = generate_answer(question)
    return jsonify({"question": question, "answer": result})

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5001)