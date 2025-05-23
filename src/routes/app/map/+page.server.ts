import { findAllTreesMap } from "$lib/server/db/colTrees";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    return {
        trees: await findAllTreesMap(),
    };
};

// src/routes/app/map/+page.server.ts
// import rawTrees from "$lib/data/tree.json";
// import speciesList from "$lib/data/species.json";

// interface Tree {
//     _id: string;
//     treeSpeciesId: string;
//     location: { coordinates: [number, number] };
//     datePlanted?: string | null;
// }

// interface Species {
//     id: string;
//     commonName: string;
//     scientificName: string;
// }

// // Cast the raw JSON so TS knows it’s an array of Tree
// const trees: Tree[] = rawTrees as unknown as Tree[];
// const species: Species[] = speciesList as unknown as Species[];

// export const load: PageServerLoad = () => {
//     const speciesMap = new Map(species.map((s) => [s.id, s]));

//     const treesWithNames = trees.map((tree: Tree) => {
//         const spec = speciesMap.get(tree.treeSpeciesId) ?? {
//             commonName: "Unknown",
//             scientificName: "Unknown",
//         };

//         return {
//             ...tree,
//             commonName: spec.commonName,
//             scientificName: spec.scientificName,
//         };
//     });

//     return { trees: treesWithNames };
// };
