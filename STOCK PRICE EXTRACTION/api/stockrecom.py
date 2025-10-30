import requests
from bs4 import BeautifulSoup
from http.server import BaseHTTPRequestHandler , HTTPServer
import json 


# function that is responsible for fetching the stock price and the stock name
def recommededStock ():
    url = "https://www.google.com/finance"
    response = requests.get(url)

    if (response):
        try : 

            parsedInfo = BeautifulSoup(response.text , "html.parser")
            classNameFromScrapedWebForNAME = "ZvmM7"
            # classNameFromScrapedWebForPRICE = "YMlKec"

            # stocknamearray = []
            stocksName = parsedInfo.find_all(class_=classNameFromScrapedWebForNAME)
            # stocksPrice = parsedInfo.find_all(class_=classNameFromScrapedWebForPRICE)
            stocknamearray = [elements.text.strip() for elements in stocksName]
            # stockpricearray = [elements.text.strip() for elements in stocksPrice]
            return {
                "stock name " : stocknamearray,
                # "stock price" : stockpricearray,
            }
        
        except Exception as error : 
            return {
                "stockName": "NIFTY 50",
                "stockPrice" : str(error)
                }
        


result = recommededStock()

print(result)