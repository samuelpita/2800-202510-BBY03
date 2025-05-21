// scripts/export-species.js
import { MongoClient } from 'mongodb';
import { writeFile } from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();  // loads .env from project root

async function exportSpecies() {
  const uri    = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DATABASE;  // or MONGODB_DB, whichever you’ve set

  if (!uri || !dbName) {
    console.error('Error: set MONGODB_URI and MONGODB_DATABASE in .env');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  console.log('Connected to MongoDB');

  const species = await client
    .db(dbName)
    .collection('treeSpecies')
    .find()
    .toArray();

  const lean = species.map(doc => ({
    id: doc._id.toString(),
    commonName: doc.commonName,
    scientificName: doc.scientificName
  }));

  const outPath = './src/lib/data/treeSpecies.json';
  await writeFile(outPath, JSON.stringify(lean, null, 2));
  console.log(`Wrote ${lean.length} species to ${outPath}`);

  await client.close();
}

exportSpecies().catch(err => {
  console.error('Export failed:', err);
  process.exit(1);
});
