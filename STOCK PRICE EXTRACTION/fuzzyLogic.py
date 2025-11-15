import csv
from rapidfuzz import process, fuzz

ticker = []
stock = {}

with open("EQUITY_L.csv", "r", encoding="utf-8") as dataset:
    reader = csv.DictReader(dataset)
    for row in reader:
        symbol = row["SYMBOL"]
        stockName = row["NAME OF COMPANY"]
        
        ticker.append(symbol)
        stock[symbol] = stockName

user_input = "Zee"

company_names = list(stock.values())

matched_name, score, index = process.extractOne(
    user_input,
    company_names,
    scorer=fuzz.WRatio
)

if score <= 70:
    print("low in score")
else:
    print("Matched Company Name:", matched_name)
    matched_symbol = list(stock.keys())[index]
    print("Ticker Symbol:", matched_symbol)
