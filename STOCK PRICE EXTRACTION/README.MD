
# GASCRAPER ![Version](https://img.shields.io/badge/version-0.1.0-red) ![Python](https://img.shields.io/badge/python-3.11-blue?logo=python) ![Vercel](https://img.shields.io/badge/-Vercel-black?logo=vercel)




Gascraper is an open-source stock market API built for developers who want to experiment, test, and build trading or analytics software using real-time market data — completely free. It offers multiple endpoints to access live stock prices, historical trends, and market insights, allowing you to seamlessly integrate accurate financial data into your apps or tools with simple API calls.




## Features

- Realtime stock updates
- Provides clean json response 
- Provides multiple endpoints asper developer requirement
- Public api and does not require any api key or registration


## API Reference

#### Get a specific stock detail

```http
GET https://the-chat-app-jbnwld16e-saifmks-projects.vercel.app/api/searchedapi.py/?symbol=TCS
```


<div align="" style="border: 2px solid #ccc; border-radius: 10px; padding: 15px; margin: 20px 0;">

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `symbol`  | `string` | Here the symbol is mentioned as `TCS`, change it accordingly as required. |

</div>


#### Fetch all stock exchange body details (NSE , BSE , ..)

```http
GET https://the-chat-app-jbnwld16e-saifmks-projects.vercel.app/api/gascraping.py
```

<div align="" style="border: 2px solid #ccc; border-radius: 10px; padding: 15px; margin: 20px 0;">

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `exchange` | `string` | (NSE, BSE, SENSEX) |

</div>



#### Fetch present days leading stock details

```http
GET https://the-chat-app-2imxqy30d-saifmks-projects.vercel.app//api/stockrecom.py
```

<div align="center" style="border: 2px solid #ccc; border-radius: 10px; padding: 15px; margin: 20px 0;">

| Parameter | Type     | Description |
| :-------- | :------- | :----------- |
| `exchange` | `string` | Fetches details from universal stocks irrespective of your geographical location. |

</div>

#### NOTE : 
This api is currently in the development state and has limited end point , more end points will be added soon with better response quality ASAP


## Endpoint Usage

```http
GET https://the-chat-app-jbnwld16e-saifmks-projects.vercel.app/api/searchedapi.py/?symbol=TCS
```





### Code for React
```javascript
import React from 'react';

function App() {
  React.useEffect(() => {
    fetch("https://the-chat-app-jbnwld16e-saifmks-projects.vercel.app/api/searchedapi.py/?symbol=TCS")
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []);

  return <div>Check console for API data</div>;
}

export default App;

```



### Code for Python
```python
import requests

url = "https://the-chat-app-jbnwld16e-saifmks-projects.vercel.app/api/searchedapi.py/?symbol=TCS"
response = requests.get(url)

if response.status_code == 200:
    print(response.json())
else:
    print("Error:", response.status_code)


```




### Code for Typescript
```typescript
async function getStockData(symbol: string) {
  const res = await fetch(`https://the-chat-app-jbnwld16e-saifmks-projects.vercel.app/api/searchedapi.py/?symbol=${symbol}`);
  const data = await res.json();
  console.log(data);
}

getStockData("TCS");
```




### Code for Java
```java
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

public class Main {
  public static void main(String[] args) throws IOException {
    String urlString = "https://the-chat-app-jbnwld16e-saifmks-projects.vercel.app/api/searchedapi.py/?symbol=TCS";
    URL url = new URL(urlString);
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    conn.setRequestMethod("GET");

    Scanner sc = new Scanner(url.openStream());
    while (sc.hasNext()) {
      System.out.println(sc.nextLine());
    }
    sc.close();
  }
}

```




### Code for C++
```cpp
#include <iostream>
#include <curl/curl.h>

size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* output) {
    output->append((char*)contents, size * nmemb);
    return size * nmemb;
}

int main() {
    CURL* curl = curl_easy_init();
    std::string readBuffer;
    if (curl) {
        curl_easy_setopt(curl, CURLOPT_URL, "https://the-chat-app-jbnwld16e-saifmks-projects.vercel.app/api/searchedapi.py/?symbol=TCS");
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
        curl_easy_perform(curl);
        curl_easy_cleanup(curl);
        std::cout << readBuffer << std::endl;
    }
    return 0;
}

```
## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started. (WILL BE ADDED SOON)

Please adhere to this project's `code of conduct`.

