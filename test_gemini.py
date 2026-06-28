import os
from google import genai

# Read from env or use placeholder
api_key = os.environ.get("GEMINI_API_KEY", "PLACEHOLDER_API_KEY")
os.environ["GEMINI_API_KEY"] = api_key

try:
    print("Initializing GenAI Client...")
    client = genai.Client()
    print("Sending request to gemini-2.5-flash...")
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents='Respond with: Gemini API connection successful!'
    )
    print("\nResponse from Gemini:")
    print(response.text.strip())
except Exception as e:
    print(f"\nError: {e}")
