import requests

api_key = "AIzaSyBEmEMaIu15j6c1zxo2OlPnzfHTcfZYasY"
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"

r = requests.post(url, json={"contents": [{"parts": [{"text": "Respond with: success"}]}]})
print(f"Status Code: {r.status_code}")
print(r.text)
