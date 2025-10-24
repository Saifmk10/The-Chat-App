# this is the file that is responsible for fetching the data from the google analytics , this is done not with an api but with the help of pure web scrapping
# next step is to host this on a backend maybe vercel or hf depending on the cpu usage of the model , 
# currently this is under developement , multiple functions will be needed in order to perfrorm various ops

import requests
from bs4 import BeautifulSoup
import time


# url for the google fin (NSE)
# URL = "https://www.google.com/finance/quote/INFY:NSE"


# visiting the website to scarp the website

# ticker = "INFY"
# visitUrl = f"https://www.google.com/finance/quote/{ticker}:NSE"

# response = requests.get(visitUrl)
# parsedInfo = BeautifulSoup(response.text , "html.parser")

# classNameFromWeb = "YMlKec fxKbKc"
# finalOutput =float(parsedInfo.find(class_= classNameFromWeb).text.strip()[1:].replace("," , "")) 
# print(finalOutput)


def niftyPriceFetching() : 
    URL = "https://www.google.com/finance/quote/NIFTY_50:INDEXNSE" #url for fetching price details for the nifty
    response = requests.get(URL)

    if (response) : 
        try:

            while response : 
                parsedInfo = BeautifulSoup(response.text , "html.parser")

                # fetching the details from the class , if the clas changes in in the google analytics then this needs to be updated
                classNameFromScrapedWeb = "YMlKec fxKbKc"
                finalOutput = float(parsedInfo.find(class_= classNameFromScrapedWeb).text.strip()[0:].replace("," , "")) #here the 0th element is being scrapped , but in the other fetched data the 1st element is stripped just change it as required
                print(finalOutput)
                time.sleep(5)

            
 
        except Exception as error : 
            print(f"Model threw an erros : {error}")


niftyPriceFetching()
    