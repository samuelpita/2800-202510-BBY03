import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findTreeId, findTreeSpeciesId } from '$lib/server/db/colTrees';
import { ObjectId } from 'mongodb';
import type { Point } from 'geojson';

interface TreeResponse {
    _id: string;
    treeSpeciesId?: string;
    location: Point;
    datePlanted: Date;
    dateCreated: Date;
    speciesInfo?: {
        commonName: string;
        scientificName: string;
    };
}

export const GET: RequestHandler = async ({ params, locals }) => {
    if (!locals.user) {
        throw error(401, 'You must be logged in to view tree details');
    }

    try {
        const { id } = params;
        
        if (!ObjectId.isValid(id)) {
            throw error(400, 'Invalid tree ID format');
        }
        
        console.log(`Looking up tree with ID: ${id}`);
        
        const tree = await findTreeId(id);
        
        if (!tree) {
            console.error('Tree not found with ID:', id);
            throw error(404, 'Tree not found');
        }
        
        const result: TreeResponse = {
            ...tree,
            _id: tree._id.toString(),
            treeSpeciesId: tree.treeSpeciesId?.toString()
        };
        
        if (tree.treeSpeciesId) {
            try {
                const speciesInfo = await findTreeSpeciesId(tree.treeSpeciesId);
                
                if (speciesInfo) {
                    result.speciesInfo = {
                        commonName: speciesInfo.commonName || 'Unknown',
                        scientificName: speciesInfo.scientificName || 'Unknown'
                    };
                }
            } catch (speciesError) {
                console.error('Error fetching species:', speciesError);
            }
        }
        
        return json(result);
    } catch (err: unknown) {
        console.error('Error fetching tree:', err);
        if (err && typeof err === 'object' && 'status' in err) {
            throw err; 
        }
        throw error(500, { message: 'Failed to fetch tree' });
    }
}; 