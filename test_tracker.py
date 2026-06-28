import os
from gemini_tracker import TrackedClient

# Set API key from environment variable or fallback
os.environ["GEMINI_API_KEY"] = os.environ.get("GEMINI_API_KEY", "PLACEHOLDER_API_KEY")

# Initialize with a low limit to trigger warning for demonstration (e.g. 2 requests limit)
print("Initializing TrackedClient with a demonstration limit of 2 requests/day...")
tracker = TrackedClient(limit_rpd=2)

print("\nExecuting Request 1...")
res = tracker.generate_content(model="gemini-2.5-flash", contents="Say: Request 1")
print(res.text.strip())

print("\nExecuting Request 2...")
res = tracker.generate_content(model="gemini-2.5-flash", contents="Say: Request 2")
print(res.text.strip())

print("\nExecuting Request 3...")
res = tracker.generate_content(model="gemini-2.5-flash", contents="Say: Request 3")
print(res.text.strip())
