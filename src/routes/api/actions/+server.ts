import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ObjectId } from 'mongodb';
import { insertTreeLog } from '$lib/server/db/colTreeLogs';
import type { TreeLogsDocument, TreeStage } from '$lib/server/db/types';

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        throw error(401, 'You must be logged in to log an activity');
    }

    try {
        const data = await request.json();
        console.log('Received log data:', data);
        const { treeId, type, details, completed, completedDate, stage, health } = data;
        
        if (!treeId || !type) {
            throw error(400, { message: 'Tree ID and activity type are required' });
        }
        
        if (!ObjectId.isValid(treeId)) {
            throw error(400, { message: 'Invalid tree ID format' });
        }
        
        console.log(`Processing activity for tree with ID: ${treeId}`);
        console.log(`Stage: ${stage}, Health: ${health}`);
        
        // Create the tree log document
        const treeLogDocument: Omit<TreeLogsDocument, '_id'> = {
            treeId: new ObjectId(treeId),
            userId: new ObjectId(locals.user._id),
            type,
            details: { 
                title: type === 'condition' ? 'Tree Condition Report' : undefined,
                body: details || '',
                tags: [type]
            },
            dateCompleted: completed ? new Date(completedDate || Date.now()) : null,
            dateCreated: new Date()
        };
        
        // Add stage and health if provided (for condition reports)
        if (type === 'condition') {
            treeLogDocument.stage = stage ? (stage as TreeStage) : 'sapling'; 
            treeLogDocument.health = health || 'good'; 
            
            console.log(`Setting stage to ${treeLogDocument.stage}`);
            console.log(`Setting health to ${treeLogDocument.health}`);
        }
        
        console.log('Tree log document to insert:', treeLogDocument);
        const result = await insertTreeLog(treeLogDocument);
        console.log('Tree log insert result:', JSON.stringify(result));
        
        return json({ 
            success: true, 
            message: 'Activity logged successfully', 
            id: result.insertedId.toString() 
        });
    } catch (err: unknown) {
        console.error('Error logging activity:', err);
        if (err && typeof err === 'object' && 'status' in err) {
            throw err; 
        }
        throw error(500, { message: 'Failed to log activity' });
    }
}; 