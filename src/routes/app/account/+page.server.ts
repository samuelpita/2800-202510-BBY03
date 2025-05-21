import { redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { findAdoptionsUserId } from "$lib/server/db/colAdoptions";
import { findTreeId, findTreeSpeciesId } from "$lib/server/db/colTrees";

export const load: PageServerLoad = async ({ cookies, locals }) => {
    const sessionId = cookies.get("sessionid");
    const userId = cookies.get("userid");

    if (!(sessionId && userId)) throw redirect(303, "/login");
    
    const adoptions = await findAdoptionsUserId(userId);
    
    const adoptedTrees = await Promise.all(
        adoptions.map(async (adoption) => {
            const tree = await findTreeId(adoption.treeId);
            
            if (!tree) return null;
            
            let speciesInfo = null;
            try {
                speciesInfo = await findTreeSpeciesId(tree.treeSpeciesId);
            } catch (error) {
                console.error("Error fetching tree species:", error);
            }
            
            return {
                adoption: {
                    ...adoption,
                    _id: adoption._id.toString(),
                    userId: adoption.userId.toString(),
                    treeId: adoption.treeId.toString(),
                    dateAdopted: adoption.dateAdopted
                },
                tree: {
                    ...tree,
                    _id: tree._id.toString(),
                    treeSpeciesId: tree.treeSpeciesId.toString(),
                    speciesInfo: speciesInfo ? {
                        ...speciesInfo,
                        _id: speciesInfo._id.toString()
                    } : undefined
                }
            };
        })
    );
    
    const validAdoptedTrees = adoptedTrees.filter(item => item !== null);
    
    return {
        user: locals.user,
        adoptedTrees: validAdoptedTrees
    };
};

export const actions: Actions = {
    logout: async ({ cookies }) => {
        cookies.delete('sessionid', { path: '/' });
        cookies.delete('userid', { path: '/' });

        redirect(303, '/login'); 
    }
};

