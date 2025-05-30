# 📄 Document Intelligence Backend (Node.js + Azure OpenAI + PostgreSQL)

This backend service extracts quotes from uploaded documents, cleans and classifies them using Azure OpenAI, stores them in PostgreSQL, and supports semantic search over extracted content.

## 🔗 Repository

**Git Repository:** [https://github.com/zeeshanrafiqrana/basic-rag.git]

```bash
git clone https://github.com/zeeshanrafiqrana/basic-rag.git
cd backend
```

---

## 🚀 Features

- Upload and extract text from PDFs, DOCX, and more
- Clean and enrich quotes using Azure OpenAI
- Classify quotes by category and subcategory
- Generate embeddings for semantic search (pgvector)
- Store metadata in PostgreSQL via Sequelize
- Semantic search API with natural language query support

---

## 🛠️ Tech Stack

- **Node.js** + **Express**
- **Sequelize ORM**
- **PostgreSQL** with `pgvector` extension
- **Azure OpenAI** (GPT & Embedding APIs)
- **Multer** for file upload
- **dotenv** for config
- **OpenAI SDK** (Azure-compatible)

---

## 📁 Project Structure

```
.
├── app/
│   ├── controllers/     # API logic
│   ├── service/         # AzureOpenAIService, UploadService
│   ├── repositories/    # Sequelize DB operations
│   └── models/          # Sequelize schemas
├── routes/
├── uploads/             # Uploaded files (temp storage)
├── config/              # DB connection
├── .env
└── server.js
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```env
# Azure OpenAI
AZURE_OPENAI_KEY=your-azure-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
AZURE_OPENAI_API_VERSION=2024-02-01
AZURE_OPENAI_MODEL=gpt-35-turbo           # For chat completions
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=embedding-model-name-here

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# App
PORT=5000
NODE_ENV=development
```

---

## 🧱 Database Setup

1. Create a PostgreSQL database.

2. Enable the pgvector extension:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

3. Run Sequelize migrations to create tables:

```bash
npx sequelize-cli db:migrate
```

---

## 📦 Install Dependencies

```bash
npm install
```

---

## ▶️ Run the Server

```bash
npm start
```

Server will run on http://localhost:5000

---

## 📤 Upload Document API

**POST** `/upload-docs`

Upload one or more documents (PDF, DOCX, TXT) and extract + classify quotes.

**Request:**
- Content-Type: `multipart/form-data`
- Field name: `files`

**Example with cURL:**

```bash
curl -X POST http://localhost:5000/upload/:conversassionId \
  -F "files=@./example.pdf"
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "originalName": "example.pdf",
      "quotes": [
        {
          "originalText": "...",
          "cleanedText": "...",
          "classification": {
            "category": "Policy",
            "subcategory": "Election Rules",
            "confidence": 0.94
          },
          "embedding": [0.012, -0.003, ...]
        }
      ]
    }
  ]
}
```

---

## 🔍 Semantic Search API

**POST** `/search/:conversassionId`

Search through all stored quotes using a natural language query.

**Body:**

```json
{
  "query": "can someone run for two offices in Tennessee?"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "data": [
    {
      "originalText": "...",
      "cleanedText": "...",
      "similarity": 0.12
    }
  ]
}
```

---

## 🧠 Azure OpenAI Requirements

You must have:

- A deployed Azure OpenAI resource
- A deployment name for:
  - A chat model (gpt-35-turbo, etc.)
  - An embedding model (text-embedding-3-small)

**Important:** The deployment name, not model name, is used in the API

Ask your Azure admin to confirm:
✅ "We have a deployment for text-embedding-3-small called embedding-model."

---

## 🧪 Testing & Debugging Tips

- Use `console.log(process.env...)` to verify loaded config
- Log `response.data` and `.status` from OpenAI SDK
- Check Postgres manually if results aren't being saved

---

## 🚀 Quick Start Guide

1. **Clone the repository:**
   ```bash
   git clone [your-repo-url]
   cd document-intelligence-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your Azure OpenAI and PostgreSQL credentials

4. **Set up database:**
   ```bash
   createdb your_db_name
   psql -d your_db_name -c "CREATE EXTENSION IF NOT EXISTS vector;"
   npx sequelize-cli db:migrate
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

6. **Test the API:**
   ```bash
   curl -X POST http://localhost:5000/upload-docs -F "files=@./test-document.pdf"
   ```

---


