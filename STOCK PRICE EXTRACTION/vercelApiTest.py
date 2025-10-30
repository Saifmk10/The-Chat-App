import requests
import time  # needed for sleep

# Replace this URL with your actual Vercel API endpoint (without .py)
url1 = "https://the-chat-app-jbnwld16e-saifmks-projects.vercel.app/api/searchedapi.py/?symbol=TCS"
url2 = "https://the-chat-app-jbnwld16e-saifmks-projects.vercel.app/api/gascraping.py"
try:
    while True:  # loop indefinitely
        response1 = requests.get(url1)
        response2 = requests.get(url2)
        print("Status Code:", response1.status_code)
        print("Status Code:", response2.status_code)
        print("Response:")
        print(response1.json())
        print(response2.json())

        # If it's a JSON API, print JSON
        # try:
        #     print("JSON Response:")
        #     print(response.json())
        # except Exception:
        #     pass

        # Wait for 5 seconds before next call
        time.sleep(1)

except requests.exceptions.RequestException as e:
    print("Error:", e)
