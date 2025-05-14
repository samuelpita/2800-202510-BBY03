import { findTreeId, findTreeSpeciesId } from "$lib/server/db/colTrees";
import type { RequestEvent } from "@sveltejs/kit";

export const load = async ({ params }: RequestEvent) => {
    const id = params.id;
    
    if (!id) {
        return { tree: {} };
    }

    const tree = await findTreeId(id).then(async (doc) => {
        if (doc) {
            let speciesInfo = null;
            try {
                speciesInfo = await findTreeSpeciesId(doc.treeSpeciesId);
            } catch (error) {
                console.error("Error fetching tree species:", error);
            }
            
            const serializedTree = {
                ...doc,
                _id: doc._id.toString(),
                treeSpeciesId: doc.treeSpeciesId.toString(),
                speciesInfo: speciesInfo ? {
                    ...speciesInfo,
                    _id: speciesInfo._id.toString()
                } : undefined
            };
            
            return serializedTree;
        }

        return null;
    });

    return {
        tree: tree || {},
    };
}; 