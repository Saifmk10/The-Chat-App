# Users Chat Page

The **Users Chat Page** is the main screen where users can send and receive messages in real time.  
This screen renders the full chat interface, including the message history, message input field, and the chat header.

---

## 📌 Purpose of This Screen

- Acts as the **main chat interface** between two users.
- Renders all chat bubbles (sent + received).
- Handles keyboard behavior so the chat input adjusts correctly.
- Displays chat-specific header information.
- Connects with the backend via child components to show real-time messages.

---

## 🧩 Components Included

| Component Name          | Purpose                                                                 |
|-------------------------|-------------------------------------------------------------------------|
| `Header`                | Displays the chat header with username, back button, and user info.     |
| `ChatHolderContainer`  | Renders all chat messages in order (sent & received).                    |
| `ChatInput`            | The input field where users type and send messages.                      |

---

## 🧠 Key Functionalities

### **Keyboard Handling**
- Listens for keyboard show/hide events.
- Adjusts the bottom padding of the input bar on Android.
- Prevents UI overlap when typing.

### **Message Rendering**
- Uses a `ScrollView` to render messages with smooth scrolling.
- Displays all chat bubbles using the `ChatHolderContainer` component.

### **Safe Area Support**
- Wrapped in `SafeAreaView` to avoid overlapping with notches and system bars.

---

## 📁 Notes

- This screen does **not** handle message sending or receiving logic directly.  
  All backend operations happen inside `ChatHolderContainer` and `ChatInput`.
- The layout is optimized for both iOS and Android.
- Designed as the main container for all chat-related elements.

---
