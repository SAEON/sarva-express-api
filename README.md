# sarva-express-api

Express API server for interfacing with the PostgreSQL database for SARVA. This API enables spatial data access and manipulation for environmental, social, and economic risk assessments in Southern Africa, and the rest of Africa.

## 🚀 Getting Started

### **1. Prerequisites**

Ensure you have the following installed:

- **Node.js** (>= 16.x) (download here: <https://nodejs.org/en/download>)
- **PostgreSQL** (>= 14.x) (download here: <https://www.postgresql.org/download/>)
- **Git** (download here: <https://git-scm.com/downloads>)

### **2. Clone the Repository**

```sh
git clone https://github.com/SAEONData/sarva-express-api.git
cd sarva-express-api
```

### **3. Install Dependencies**

From the project root directory (i.e sarva-express-api/) run the command:

```sh
npm install
```

### **4. Configure Environment Variables**

Create a .env file in the root directory:

```ini
# Server
PORT=5000
NODE_ENV=development

# Database
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_NAME=sarva
DB_PORT=5432
DB_SSL=false  # Change to true for production with SSL encryption
```

🔹 Note: Replace your_db_user, your_db_password, and your_db_host with your actual database credentials.

### **5. Run the Server**

Development Mode (with Auto-restart)

```sh
npm run dev
```

Production Mode

```sh
npm start
```

### **6. Test Database Connection**

Run the following command to check if the database is accessible:

```sh
node test-db.js
```

✅ Expected output:

```yml
Connected successfully at: 2025-03-24 12:34:56.789
```

## 📜 Available NPM Commands

| Command            | Description                                                          |
| ------------------ | -------------------------------------------------------------------- |
| `npm install`      | Install all dependencies                                             |
| `npm run dev`      | Start the server in **development mode** with auto-restart (nodemon) |
| `npm start`        | Start the server in **production mode**                              |
| `npm test`         | Run all **unit tests** (Jest)                                        |
| `npm run lint`     | Run **ESLint** for code quality                                      |
| `npm run lint:fix` | Fix linting issues automatically                                     |
| `npm run format`   | Format code using **Prettier**                                       |
