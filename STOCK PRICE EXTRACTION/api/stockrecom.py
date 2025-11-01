# currently this file only displays the name of the stocks that are trending for a particular day , this price is not displayed in this api
# the plan is to fetch the name of the stock from there an then store the name within a useState and then fetch the stock price realtime using the serchedapi end point

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
        


# result = recommededStock()

class handler(BaseHTTPRequestHandler):
    def do_GET(self):

        try : 
            recommededStockOutput = recommededStock()

            result = {
                "STOCKS :" : recommededStockOutput
            }

            self.send_response(200)
            self.send_header('Content-type','application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))

        except Exception as error : 
            self.send_response(500)
            self.send_header('Content-type','application/json')
            self.end_headers()
            self.wfile.write(json.dumps(error).encode('utf-8'))

if __name__ == "__main__":
    PORT = 8000
    server = HTTPServer(("localhost", PORT), handler)
    print(f"Local server running at http://localhost:{PORT}")
    print("Use curl to test: curl http://localhost:8000")
    server.serve_forever()  