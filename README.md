# Express Auth Server

A simple Node.js + Express server that handles **user registration**, **login**, 
**session management**, and **static file serving**.
User data is stored locally in `data/db.json`, and passwords are securely 
hashed with **bcrypt**.

---
# Features

- **User Registration** – Stores new users with hashed passwords.
- **Login** – Validates credentials and stores user info in a session.
- **Session Management** – Keeps users logged in using `express-session`.
- **CORS Enabled** – Allows cross-origin requests (configurable).
- **Static File Serving** – Serves files from the `public` directory.
- **Logout** – Destroys session on request.

---

# Libraries Used

Main Dependencies
- [express](https://www.npmjs.com/package/express) – Web framework.
- [cors](https://www.npmjs.com/package/cors) – Enables Cross-Origin 
- Resource Sharing.
- [express-session](https://www.npmjs.com/package/express-session) – Session 
- and cookie management.
- [bcrypt](https://www.npmjs.com/package/bcrypt) – Secure password hashing.

### Built-in Node.js Modules
- **fs** – File system operations.
- **path** – File and directory path utilities.
- **url** – Convert file URLs to paths.

---


#  Installation & Setup

1. **Install dependencies**
```bash
npm install
```

2. **Run the server**
```bash
node app-server.mjs from infrarstructure folder
npm start from the project folder
```

4. Server will start at:
```
http://localhost:3000
```

---

# API Endpoints

| Method | Endpoint          | Description |
|--------|-------------------|-------------|
| **POST** | `/register`       | Register a new user (JSON body: `firstName`, `lastName`, `userName`, `password`). |
| **POST** | `/login`          | Log in a user (JSON body: `userName`, `password`). |
| **GET**  | `/session-user`   | Get current logged-in user info. |
| **POST** | `/logout`         | Log out the current user. |

