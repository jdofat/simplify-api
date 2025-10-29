from flask import Flask, request, jsonify, render_template
import openai
import os

app = Flask(__name__)

# Set your API key (recommended: use environment variable instead of hardcoding)
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/")
def home():
    return render_template("simplify.html")

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
    return jsonify({"explanation": explanation})

except Exception as e:
    return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
