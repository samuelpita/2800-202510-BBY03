// scripts/clean-species.js
import fs from 'fs/promises';
import path from 'path';

function toTitleCase(str) {
  return str
    .split(/[\s-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function formatScientific(str) {
  const parts = str.split(/\s+/);
  return parts
    .map((part, i) =>
      i === 0
        ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        : part.toLowerCase()
    )
    .join(' ');
}

async function cleanSpecies() {
  const inPath  = path.resolve('src/lib/data/treeSpecies.json');
  const outPath = path.resolve('src/lib/data/species.json');

  // 1) Read and parse the raw data
  const raw = JSON.parse(await fs.readFile(inPath, 'utf-8'));

  // 2) Transform entries
  const cleaned = raw
    .map(entry => ({
      id: entry._id.toString(),
      commonName: toTitleCase(entry.commonName),
      scientificName: formatScientific(entry.scientificName)
    }))
    .sort((a, b) => a.commonName.localeCompare(b.commonName));

  // 3) Write out the cleaned JSON
  await fs.writeFile(outPath, JSON.stringify(cleaned, null, 2));
  console.log(`Wrote ${cleaned.length} species to ${outPath}`);
}

cleanSpecies().catch(err => {
  console.error('Error cleaning species:', err);
  process.exit(1);
});
