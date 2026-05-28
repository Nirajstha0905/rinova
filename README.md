# Rinova CRM

Rinova CRM is organized as a client/server project.

## Structure

```text
client/   React CRM frontend
server/   Express API and MongoDB connection
```

## Commands

Run the React client:

```powershell
npm start
```

Run the Express server:

```powershell
npm run server
```

Run tests:

```powershell
npm run test:ci
```

Build the client:

```powershell
npm run build
```

## Environment

Keep server secrets in:

```text
server/.env
```

Expected values:

```text
Mongo_URI=your_mongodb_connection_string
DB_NAME=rinova_crm
PORT=5000
```

The server exposes a health check at:

```text
http://localhost:5000/api/health
```
