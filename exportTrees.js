// exportTrees.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function dumpAllTrees() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Error: MONGODB_URI is not set in .env');
    process.exit(1);
  }

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DATABASE);
    const trees = await db.collection('trees').find({}).toArray();
    console.log(JSON.stringify(trees, null, 2));
  } catch (err) {
    console.error('Failed to fetch trees:', err);
  } finally {
    await client.close();
  }
}

dumpAllTrees();
