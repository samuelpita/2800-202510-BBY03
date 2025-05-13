import { ensureId, findTreeSpeciesId, findTreeStats, getTreesCollection } from "$lib/server/db";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { TreeDocument, TreeSpeciesDocument, TreeStatsDocument } from "$lib/server/dbTypes";

export const load: PageServerLoad = async ({ params }) => {
    const { id } = params;

    return await getTreesCollection().then(async (trees) => {
        let treeDoc = (await trees.findOne({ _id: ensureId(id) })) as TreeDocument;

        if (treeDoc) {
            const treeSpecies = (await findTreeSpeciesId(
                treeDoc.treeSpeciesId,
            )) as TreeSpeciesDocument;

            const treeStats = (await findTreeStats(id)) as TreeStatsDocument;

            if (!(treeStats && treeSpecies)) throw error(404);

            return {
                tree: {
                    ...treeDoc,
                    _id: treeDoc._id.toString(),
                    treeSpeciesId: treeSpecies._id.toString(),
                },
                treeSpecies: {
                    ...treeSpecies,
                    _id: treeSpecies._id.toString(),
                    commonName: treeSpecies.commonName.toLowerCase(),
                    scientificName: treeSpecies.scientificName.toLowerCase(),
                },
                treeStats: {
                    ...treeStats,
                    _id: treeStats._id.toString(),
                    treeId: treeStats.treeId.toString(),
                },
            };
        }

        throw error(404);
    });

    // try {
    //     const treesCollection = await getTreesCollection();

    //     // ✅ Assert the returned document type
    //     const tree = await treesCollection.findOne<TreeDocument>({ _id: new ObjectId(id) });

    //     if (!tree) {
    //         return {
    //             status: 404,
    //             error: new Error("Tree not found"),
    //         };
    //     }

    //     // ✅ Convert _id and return full tree with stringified _id
    //     const result: Omit<TreeDocument, "_id"> & { _id: string } = {
    //         ...tree,
    //         _id: tree._id.toString(),
    //     };

    //     return { tree: result };
    // } catch (err) {
    //     console.error("Error fetching tree by id:", err);
    //     return {
    //         status: 500,
    //         error: new Error("Server error while loading tree"),
    //     };
    // }
};
