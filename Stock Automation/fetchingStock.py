import requests
import time , csv

url = "http://localhost:8000/?symbol=REDINGTON"

try : 
    while url :
        response = requests.get(url)
        print("response : " , response.status_code)
        print(response.json())

        currentTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        data = response.json()
        # print(price["stockPrice"])

        price = float(data["stockPrice"])
        name = data["stockName"]

        with open("input.csv" , "a" , newline="") as f:
            writer = csv.writer(f)
            writer.writerow([currentTime , name ,price])
        
        time.sleep(10)


except requests.exceptions.RequestException as e:
    print("Error:", e)