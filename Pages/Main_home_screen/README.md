# Main Home Screen

The **Main Home Screen** serves as the central interface of the application.  
It contains all the primary widgets and UI components that users interact with immediately upon launching the app.

---

## 📌 Purpose of This Screen

- Acts as the **root home interface** for the application.
- Renders all major widgets such as chat-related elements, agent access, user profile section, and friend discovery.
- Handles UI display and navigation only — no heavy backend logic occurs directly here.

---

## 🧩 Widgets Included

| Widget Name                        | Purpose                                                                 |
|------------------------------------|-------------------------------------------------------------------------|
| `chatToStockToggleButtons.tsx`     | Controls which main screen is displayed — Chat screen or Agents screen. |
| `userChatWidget.tsx`               | Renders the list of users the current user has chatted with or added.   |
| `userProfileOptions.tsx`           | Displays the user's profile picture, settings menu, and logout options. |
| `AddFriends.tsx`                   | Shows all users of the app; allows adding new friends.                 |
| `StockScreen.tsx`                  | Contains the complete Agent section of the app.                         |

---

## 📁 Notes

- This screen is primarily UI-focused.
- All logic for the widgets listed above is handled inside their respective components.
- Designed to be expandable as new widgets and features are added to the platform.

---
