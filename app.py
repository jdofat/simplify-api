from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import openai
import os

# Flask app
app = Flask(__name__, static_folder="Simplify", static_url_path="")
CORS(app)

# OpenAI setup
openai.api_key = os.getenv("OPENAI_API_KEY")

# Serve frontend
@app.route("/")
def serve_index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory(app.static_folder, path)

# AI endpoint
@app.route("/simplify", methods=["POST"])
def simplify():
    data = request.get_json()
    topic = data.get("topic", "")

    if not topic:
        return jsonify({"error": "No topic provided"}), 400

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You simplify complex topics clearly for beginners."},
                {"role": "user", "content": f"Explain '{topic}' in simple terms anyone can understand."}
            ]
        )
        explanation = response["choices"][0]["message"]["content"]
        return jsonify({"simplifiedText": explanation})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
