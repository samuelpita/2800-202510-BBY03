import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { findUserLogs } from "$lib/server/db/colTreeLogs";
import { findTreeId, findTreeSpeciesId } from "$lib/server/db/colTrees";
import { ObjectId } from "mongodb";

export const load: PageServerLoad = async ({ cookies, locals }) => {
    const sessionId = cookies.get("sessionid");
    const userId = cookies.get("userid");

    if (!(sessionId && userId)) throw redirect(303, "/login");
    
    if (!locals.user) throw redirect(303, "/login");

    console.log('Loading logs for user:', userId);

    // Fetch user's tree logs
    const rawLogs = await findUserLogs(userId);
    console.log('Raw logs from database:', JSON.stringify(rawLogs, null, 2));
    
    if (rawLogs.length === 0) {
        console.log('No logs found for this user');
    }
    
    const logs = await Promise.all(rawLogs.map(async (log) => {
        const processedLog = {
            _id: log._id.toString(),
            treeId: log.treeId.toString(),
            userId: log.userId.toString(),
            type: log.type || 'unknown',
            details: log.details || { body: '' },
            stage: log.stage,
            health: log.health,
            dateCreated: log.dateCreated,
            dateCompleted: log.dateCompleted
        };
        
        console.log('Processing log:', JSON.stringify(processedLog, null, 2));
        
        // Fetch tree details
        let treeDetails = null;
        try {
            const tree = await findTreeId(log.treeId);
            if (tree) {
                treeDetails = {
                    _id: tree._id.toString(),
                    location: tree.location,
                    species: null 
                };
                // Get species info
                if (tree.treeSpeciesId) {
                    const species = await findTreeSpeciesId(tree.treeSpeciesId);
                    if (species) {
                        treeDetails = {
                            ...treeDetails,
                            species: {
                                commonName: species.commonName,
                                scientificName: species.scientificName
                            }
                        };
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching tree details for log:', error);
        }
        
        return {
            ...processedLog,
            tree: treeDetails
        };
    }));

    console.log('Returning logs:', logs.length);
    
    return {
        logs
    };
}; 