const { MongoClient } = require('mongodb');
const config = require('../db-config');

let client = null;
let db = null;

async function connectToDatabase() {
  if (client) return db;
  let uri = config.MONGODB_URI;
  if (config.MONGODB_USER && config.MONGODB_PASSWORD) {
    uri = uri.replace('mongodb://', `mongodb://${config.MONGODB_USER}:${config.MONGODB_PASSWORD}@`);
  }
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(config.DB_NAME);
  return db;
}

async function getDatabase() {
  if (!db) db = await connectToDatabase();
  return db;
}

module.exports = { getDatabase }; 