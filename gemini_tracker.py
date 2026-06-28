import os
import json
from datetime import datetime
from google import genai

class TrackedClient:
    def __init__(self, limit_rpd=1500, log_path="gemini_usage.json"):
        """
        TrackedClient wraps the google-genai Client to log daily requests and warn
        before reaching the Free Tier daily limit (default: 1500 RPD).
        """
        self.limit_rpd = limit_rpd
        self.log_path = log_path
        self.client = genai.Client()
        self._load_usage()

    def _load_usage(self):
        today = datetime.now().strftime("%Y-%m-%d")
        if os.path.exists(self.log_path):
            try:
                with open(self.log_path, "r") as f:
                    self.usage = json.load(f)
            except Exception:
                self.usage = {}
        else:
            self.usage = {}
        
        if today not in self.usage:
            self.usage[today] = 0

    def _save_usage(self):
        try:
            with open(self.log_path, "w") as f:
                json.dump(self.usage, f)
        except Exception as e:
            print(f"Warning: Failed to save usage log: {e}")

    def generate_content(self, model, contents, **kwargs):
        self._load_usage()
        today = datetime.now().strftime("%Y-%m-%d")
        current_count = self.usage[today]

        # Warning when approaching limit (e.g. 90% of RPD)
        warning_threshold = int(self.limit_rpd * 0.9)
        if current_count >= self.limit_rpd:
            print(f"\n[WARNING] Daily free tier limit of {self.limit_rpd} requests has been reached!")
        elif current_count >= warning_threshold:
            print(f"\n[WARNING] You are close to the free tier limit. Used {current_count}/{self.limit_rpd} requests today.")

        # Execute call
        response = self.client.models.generate_content(
            model=model,
            contents=contents,
            **kwargs
        )

        # Increment and save
        self.usage[today] += 1
        self._save_usage()
        return response
