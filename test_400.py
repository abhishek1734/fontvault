import os
import requests
import json

# Set API key
api_key = os.environ.get("GEMINI_API_KEY", "PLACEHOLDER_API_KEY")

print("Fetching Google Fonts list...")
r_fonts = requests.get(f"https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBEmEMaIu15j6c1zxo2OlPnzfHTcfZYasY")
google_fonts = r_fonts.json().get("items", [])[:1000] # Take first 1000 fonts

print(f"Fetched {len(google_fonts)} fonts. Formatting database list...")
all_fonts_list = []
for item in google_fonts:
    mapped_style = "Sans-Serif"
    cat = item.get("category", "")
    if cat == "serif": mapped_style = "Serif"
    elif cat == "display": mapped_style = "Display"
    elif cat == "handwriting": mapped_style = "Handwriting"
    elif cat == "monospace": mapped_style = "Monospace"
    
    all_fonts_list.append({
        "name": item.get("family"),
        "category": mapped_style,
        "provider": "google"
    })

system_prompt = f"""You are a typography specialist. Analyze the user's project intent/design goal and recommend the best fonts from the provided database.
Available Font Database:
{json.dumps(all_fonts_list)}

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
