from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types
import json

app = Flask(__name__)
CORS(app)

# Replace with your NEW Gemini API key
API_KEY = "AQ.Ab8RN6IYu4nRikfnQdhBhKHRbWDGxk1faFk9vRiEYhtPo2llmg"

client = genai.Client(api_key=API_KEY)

@app.route("/")
def home():
    return "AI Disaster Management Backend Running"

@app.route("/analyze", methods=["POST"])
def analyze():

    if "image" not in request.files:
        return jsonify({"success": False, "message": "No image uploaded"})

    image = request.files["image"]
    image_bytes = image.read()

    prompt = """
You are DisasterGuardian AI.

Analyze the uploaded disaster image.

Return ONLY valid JSON in this exact format:

{
  "disaster_type":"",
  "severity":"",
  "confidence":"",
  "summary":"",
  "immediate_actions":[
    "",
    "",
    "",
    "",
    ""
  ],
  "safety_tips":[
    "",
    "",
    "",
    "",
    ""
  ],
  "recommended_contacts":[
    "Police",
    "Fire Department",
    "Ambulance",
    "Disaster Management Authority"
  ],
  "equipment_needed":[
    "",
    "",
    ""
  ]
}

Rules:

Disaster Type:
Flood
Wildfire
Earthquake
Cyclone
Landslide
Building Collapse
Storm
Road Accident
Unknown

Severity:
Low
Medium
High
Critical

Confidence:
0-100%

Return ONLY JSON.
"""

    try:

        response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[
        prompt,
        types.Part.from_bytes(
            data=image_bytes,
            mime_type=image.mimetype,
        ),
    ],
    config=types.GenerateContentConfig(
        response_mime_type="application/json"
    )
)

        return jsonify({
            "success": True,
            "result": response.text
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
