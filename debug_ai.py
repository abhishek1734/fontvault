import os
import json
import requests

# Set API key
api_key = os.environ.get("GEMINI_API_KEY", "PLACEHOLDER_API_KEY")

# Load some sample fonts to represent the database
sample_fonts = [
    {"name": "Instrument Serif", "category": "Serif", "provider": "google"},
    {"name": "Inter", "category": "Sans-Serif", "provider": "google"},
    {"name": "Playfair Display", "category": "Serif", "provider": "google"},
    {"name": "DM Serif Display", "category": "Serif", "provider": "google"},
    {"name": "Satoshi", "category": "Sans-Serif", "provider": "fontshare"},
    {"name": "Clash Display", "category": "Display", "provider": "fontshare"},
    {"name": "Cabinet Grotesk", "category": "Sans-Serif", "provider": "fontshare"},
    {"name": "General Sans", "category": "Sans-Serif", "provider": "fontshare"},
    {"name": "Zodiak", "category": "Serif", "provider": "fontshare"},
    {"name": "Switzer", "category": "Sans-Serif", "provider": "fontshare"},
    {"name": "Boska", "category": "Serif", "provider": "fontshare"},
    {"name": "Chillax", "category": "Sans-Serif", "provider": "fontshare"},
    {"name": "Realistic Nature", "category": "Script", "provider": "custom"},
    {"name": "Coolvetica", "category": "Sans-Serif", "provider": "custom"},
    {"name": "Oleo Script", "category": "Display", "provider": "google"}
]

system_prompt = f"""You are a typography specialist. Analyze the user's project intent/design goal and recommend the best fonts from the provided database.
Available Font Database:
{json.dumps(sample_fonts)}

Return a JSON object matching this schema exactly. You must ONLY recommend font names that exist in the provided database. Do not hallucinate or use external font names.

JSON Schema:
{{
  "headline_fonts": [
    {{
      "name": "string (Exact font name from database)",
      "explanation": "string"
    }}
  ],
  "body_fonts": [
    {{
      "name": "string (Exact font name from database)",
      "explanation": "string"
    }}
  ],
  "pairings": [
    {{
      "heading_font": "string (Exact font name from database)",
      "body_font": "string (Exact font name from database)",
      "score": number,
      "reason": "string"
    }}
  ],
  "insights": {{
    "emotional_tone": "string",
    "brand_positioning": "string",
    "visual_strategy": "string"
  }}
}}"""

print("Sending request to Gemini API...")
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
response = requests.post(url, json={
    "contents": [{
        "parts": [
            {"text": system_prompt},
            {"text": "User request: i want to build a minimal coffee brand"}
        ]
    }],
    "generationConfig": {
        "responseMimeType": "application/json"
    }
})

print(f"Status Code: {response.status_code}")
try:
    print(json.dumps(response.json(), indent=2))
except Exception:
    print(response.text)
