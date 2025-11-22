import pandas as pd

data = pd.read_csv("input.csv")
# print("dropped data :",data.drop(['EXTRACTEED_TIME'] , axis=0))
print("before data cleaing :",data.head())
print("")
print("before data cleaing :",data.info())
print("")
print("before data cleaing :",data.index)
print("")
print("")
print(data[["STOCK_NAME" ,  " EXTRACTED_PRICE"]])

print(data[(data["EXTRACTED_TIME"] == "2025-11-21 11:02:10")])

# if data.isnull().any().any() : 
#     data.dropna(axis=0 , inplace=True)
#     print("After data cleaning :",data.values)