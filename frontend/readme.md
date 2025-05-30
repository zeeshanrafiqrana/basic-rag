# Agentic AI Quote Extraction System – Backend

This is the backend service for the **Agentic AI Quote Extraction System**, responsible for handling conversations, document uploads, quote extraction, and AI-powered responses via Azure OpenAI.

---

## 🚀 Features

* RESTful API for managing conversations
* Upload and parse documents into quotes
* Store quotes in a PostgreSQL database
* Use Azure OpenAI to generate answers based on document context
* Token-based authentication
* Sequelize ORM for database interaction

---

## 🛠️ Tech Stack

* Node.js
* Express
* PostgreSQL
* Sequelize
* Azure OpenAI
* Multer (for file uploads)

---

## 📁 Project Structure

```
.
├── controllers/
├── models/
├── routes/
├── services/
├── db/
├── middleware/
├── .env.example
├── server.js
└── README.md
```

---

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/zeeshanrafiqrana/basic-rag.git
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` and rename it to `.env`:

```bash
cp .env.example .env
```

### 5. Start the server

```bash
npm run dev
```

Server will start at: `http://localhost:5174/`

---

## 🔐 Authentication

The backend uses JWT authentication.

* Generate or obtain a token using the login route (if implemented).
* Pass the token via the `Authorization` header:

```http
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📦 API Endpoints (Overview)

### Conversations

* `GET /conversations` – List all conversations
* `POST /conversations` – Create new conversation

### Messages

* `POST /search/:conversationId` – Ask question about uploaded documents
* `POST /upload/:conversationId` – Upload and parse documents into quotes

> All routes require `Authorization` header with a valid token.

---

## 📄 Environment Variables

See `.env.example` for all required keys. Key ones:

* `VITE_SECRET_TOKEN`: Secret Token that Pass in API's Header
* `VITE_API_URL`: API's URL

---

## ✅ License

MIT – Free to use and modify.

---

