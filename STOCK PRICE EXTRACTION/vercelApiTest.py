import requests

# Replace this URL with your actual Vercel API endpoint
url = "https://scraped-stock-k4wn0csa6-saifmks-projects.vercel.app/api/gascraping.py"

try:
    # For GET request
    response = requests.get(url)
    print("Status Code:", response.status_code)
    print("Response:")
    print(response.text)

    # If it's a JSON API, you can print JSON like this:
    try:
        print("JSON Response:")
        print(response.json())
    except Exception:
        pass

except requests.exceptions.RequestException as e:
    print("Error:", e)
