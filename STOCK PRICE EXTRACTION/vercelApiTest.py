import requests
import time  # needed for sleep

# Replace this URL with your actual Vercel API endpoint (without .py)
url1 = "https://the-chat-app-owr5pav8s-saifmks-projects.vercel.app/api/searchedapi.py?symbol=ashok%20leyland"
url2 = "https://the-chat-app-owr5pav8s-saifmks-projects.vercel.app/api/gascraping.py"
url3 = "https://the-chat-app-2imxqy30d-saifmks-projects.vercel.app/api/stockrecom.py"
try:
    # while True:  # loop indefinitely
        response1 = requests.get(url1)
        response2 = requests.get(url2)
        response3 = requests.get(url3)
        print("Status Code:", response1.status_code)
        print("Status Code:", response2.status_code)
        print("Status Code:", response3.status_code)
        print("Response:")
        print(response1.json())
        print(response2.json())
        print(response3.json())

        # if needed to call the api in a loop use this for realtime stock updates   

        # If it's a JSON API, print JSON
        # try:
        #     print("JSON Response:")
        #     print(response.json())
        # except Exception:
        #     pass

        # Wait for 5 seconds before next call
        # time.sleep(1)

except requests.exceptions.RequestException as e:
    print("Error:", e)
