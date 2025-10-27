import requests
import time  # needed for sleep

# Replace this URL with your actual Vercel API endpoint (without .py)
url = "https://the-chat-app-3o3494g6j-saifmks-projects.vercel.app/api/gascraping.py"

try:
    while True:  # loop indefinitely
        response = requests.get(url)
        print("Status Code:", response.status_code)
        print("Response:")
        print(response.text)

        # If it's a JSON API, print JSON
        # try:
        #     print("JSON Response:")
        #     print(response.json())
        # except Exception:
        #     pass

        # Wait for 5 seconds before next call
        time.sleep(5)

except requests.exceptions.RequestException as e:
    print("Error:", e)
