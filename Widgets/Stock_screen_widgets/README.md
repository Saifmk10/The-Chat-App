# Stock Addition Module

This module manages the complete flow for adding stocks into the user’s analysis.  
It handles fetching stock data, displaying it in a popup, enabling search, and storing selections in Firebase.

---

## Overview

The module includes:

- Fetching stock details when the user taps the **Add Stock** button  
- Passing the fetched data into the selection popup  
- Rendering stocks using dynamic mapping  
- Adding selected stocks to the user’s analysis  
- Searching for stocks inside the popup

---

## Core Features

### 1. Fetch Stock Details
Triggered when the user clicks the **Add Stock** button.  
The module fetches metadata for the selected stock and stores it for later use.

---

### 2. Populate the Selection Popup
The `popToSelectStock` component reads the stored stock data and renders it.  
Each stock is generated using `map()` with unique keys.

---

### 3. Display Stock Data
All fetched stocks are shown inside the popup in a structured list, allowing users to choose a stock visually.

---

### 4. Add Stock to User Analysis
Inside `popToSelectStock`, the user can add a stock by clicking its name.  
This triggers Firebase logic to save the stock into the user's analysis list.

---

### 5. Search Functionality
The popup includes a search bar.  
Users can filter stocks by entering text and add filtered items via a click.

---

## Flow Summary

1. User taps **Add Stock**  
2. Stock data is fetched  
3. Fetched data is passed to `popToSelectStock`  
4. Popup displays available stocks  
5. User selects a stock → Firebase saves it  
6. Optional: User searches within the popup

---
