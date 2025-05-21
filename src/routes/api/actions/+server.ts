import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ObjectId } from 'mongodb';
import { MONGODB_DATABASE } from '$env/static/private';
import { startConnection } from '$lib/server/db/mongo';

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        throw error(401, 'You must be logged in to log an activity');
    }

    try {
        const data = await request.json();
        const { treeId, type, details, completed, completedDate } = data;
        
        console.log(`Using MongoDB database: ${MONGODB_DATABASE}`);
        
        if (!treeId || !type) {
            throw error(400, { message: 'Tree ID and activity type are required' });
        }
        
        if (!ObjectId.isValid(treeId)) {
            throw error(400, { message: 'Invalid tree ID format' });
        }
        
        console.log(`Processing activity for tree with ID: ${treeId}`);
        
        const client = await startConnection();
        const db = client.db(MONGODB_DATABASE);
        const treeLogsCollection = db.collection('treeLogs');
        
        const treeLogDocument = {
            treeId: ObjectId.createFromHexString(treeId),
            userId: locals.user._id,
            type,
            details: { body: details || '' },
            dateCompleted: completed ? new Date() : null,
            dateCreated: new Date()
        };
        
        const result = await treeLogsCollection.insertOne(treeLogDocument);
        console.log('Tree log insert result:', JSON.stringify(result));
        
        const count = await treeLogsCollection.countDocuments();
        console.log(`Total documents in treeLogs collection: ${count}`);
        
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