# function that is responsible for fetching the stock price that the user has searched for
# currently we need to add the stock name correctly in order to fetch the data
# needs to be connected to rapidfuzz inorder to fetch the data from the nse database to conpare the name of he stock the user has searched for


from http.server import BaseHTTPRequestHandler , HTTPServer
from urllib.parse import urlparse, parse_qs
from bs4 import BeautifulSoup
import requests
import json
import csv
from rapidfuzz import process, fuzz


# bellow code is for the fuzzy logic , where the code for fetching the data set has been placed outside the function so that the dataset will be fetched only once.
ticker = []
stock = {}

with open("EQUITY_L.csv", "r", encoding="utf-8") as dataset:
    reader = csv.DictReader(dataset)
    for row in reader:
        symbol = row["SYMBOL"]
        stockName = row["NAME OF COMPANY"]
        
        ticker.append(symbol)
        stock[symbol] = stockName




# this function is the function repsonsible for the fuzzy code where the users can search for any stock and the ticket of that stock will be returned 
def fuzzyLogic(userSearchedStock):

    user_input = userSearchedStock

    companyNames = list(stock.values())

    stockNameMachedTo, score, index = process.extractOne(user_input, companyNames, scorer=fuzz.WRatio)

    if score <= 70:
        print("low in score")
    else:
        print("Matched Company Name:", stockNameMachedTo)
        matched_symbol = list(stock.keys())[index]
        print("Ticker Symbol:", matched_symbol)

    return matched_symbol






def userSearchedStockPrice(stockName):
    # there is a problem in this url , thats bcs when we search for any indian stock it uses the NSE market but then when it comes to other maker the stock is failing to be fetched as the stock changes  
    stockTicket = fuzzyLogic(stockName)

    if not stockTicket:
        return{
            "stock" : "no matching stock",
            "input stock" : stockName
        }
    
    URL = f"https://www.google.com/finance/quote/{stockTicket}:NSE"
    response = requests.get(URL)

    if response:
        try:
            parsedInfo = BeautifulSoup(response.text, "html.parser")
            classNameFromScrapedWeb = "YMlKec fxKbKc"
            finalOutput = float(
                parsedInfo.find(class_=classNameFromScrapedWeb)
                .text.strip()[1:]
                .replace(",", "")
            )
            return {
                "stockName": stockTicket,
                "stockPrice": finalOutput,
            }

        except Exception as error:
            return {
                "stockName": stockTicket,
                "stockPrice": f"Error: {str(error)}"
            }

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse query parameters
        query = parse_qs(urlparse(self.path).query)
        stockName = query.get("symbol", [None])[0] 

        # Validate input
        if not stockName:
            self.send_response(400)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Missing 'symbol' query parameter"}).encode())
            return

        # Call your scraper
        data = userSearchedStockPrice(stockName)

        # Send response
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

# used to run the code in local , used for debugging and testing purpose only

if __name__ == "__main__":
    PORT = 8000
    server = HTTPServer(("localhost", PORT), handler)
    print(f"Local server running at http://localhost:{PORT}")
    print("Use curl to test: curl http://localhost:8000")
    server.serve_forever()