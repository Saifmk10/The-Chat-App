# Login & Signup Screen

The **Login/Signup Screen** handles all user authentication flow within the app.  
It includes both UI components and backend logic required to authenticate users, create new accounts, and navigate them into the main application.

---

## 📌 Purpose of This Screen

- Acts as the **authentication gateway** for all users.
- Allows switching between **Login** and **Signup** using a toggle component.
- Contains backend logic for:
  - Creating new users
  - Logging users in
  - Navigating authenticated users to the main screen
- Provides form validation and submission handling.

---

## 🧩 Widgets Included

| Widget Name                 | Purpose                                                                 |
|-----------------------------|-------------------------------------------------------------------------|
| `LoginSignUpToggle.tsx`     | Toggles between the Login and Signup UI screens.                        |
| `LoginForm.tsx`             | Renders the login form and handles backend login logic.                 |
| `SignupForm.tsx`            | Contains the signup form and handles account creation and navigation.   |

---

## 📁 Notes

- Both Login and Signup components may include backend actions such as:
  - Firebase authentication calls  
  - User validation  
  - Error handling  
- After successful authentication, users are directed to the Main Home Screen.
- The toggle component provides a smooth switch between the two forms.

---
