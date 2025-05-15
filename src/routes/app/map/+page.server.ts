// src/routes/app/map/+page.server.ts
import treeData from '$lib/data/tree.json';   // ← make sure tree.json is in src/lib/data/
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  // we return the array under the key "trees"
  return {
    trees: treeData
  };
};
