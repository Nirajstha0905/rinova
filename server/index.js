const path = require('path');
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.Mongo_URI;

let mongoClient;
let db;

app.use(express.json());

async function connectDB() {
  if (!uri) {
    console.warn('Mongo_URI is not set. Server will run without a database connection.');
    return null;
  }

  mongoClient = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await mongoClient.connect();
  db = mongoClient.db(process.env.DB_NAME || 'rinova_crm');
  await db.command({ ping: 1 });
  console.log('Connected to MongoDB.');
  return db;
}

app.get('/', (req, res) => {
  res.send('Rinova CRM server running');
});

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    database: db ? 'connected' : 'not connected',
    service: 'rinova-crm-api',
  });
});

async function startServer() {
  try {
    await connectDB();
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
  }

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

async function shutdown() {
  if (mongoClient) {
    await mongoClient.close();
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startServer();
