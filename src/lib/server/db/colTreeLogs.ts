import { ObjectId } from "mongodb";
import { ensureId } from "./helper";
import { startConnection } from "./mongo";
import { MONGODB_DATABASE } from "$env/static/private";
import type { TreeLogsDocument } from "./types";

//#region Collection Functions

export function getTreeLogsCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection<TreeLogsDocument>("treeLogs");
    });
}

//#endregion

//#region Tree Logs Operations

/**
 * Find the latest condition log for a specific tree that has stage/health info
 */
export function findLatestTreeLog(treeId: ObjectId | string) {
    return getTreeLogsCollection().then((treeLogs) => {
        return treeLogs
            .find({ 
                treeId: ensureId(treeId),
                type: 'condition',
                $or: [
                    { stage: { $exists: true } },
                    { health: { $exists: true } }
                ]
            })
            .sort({ dateCreated: -1 })
            .limit(1)
            .toArray()
            .then(logs => logs[0] || null);
    });
}

/**
 * Find all logs for a specific tree
 */
export function findTreeLogs(treeId: ObjectId | string) {
    return getTreeLogsCollection().then((treeLogs) => {
        return treeLogs
            .find({ treeId: ensureId(treeId) })
            .sort({ dateCreated: -1 })
            .toArray();
    });
}

/**
 * Find logs created by a specific user
 */
export function findUserLogs(userId: ObjectId | string, limit?: number) {
    return getTreeLogsCollection().then((treeLogs) => {
        const query = treeLogs
            .find({ userId: ensureId(userId) })
            .sort({ dateCreated: -1 });
            
        if (limit) {
            query.limit(limit);
        }
        
        return query.toArray();
    });
}

/**
 * Insert a new tree log
 */
export function insertTreeLog(log: Omit<TreeLogsDocument, '_id'>) {
    return getTreeLogsCollection().then((treeLogs) => {
        return treeLogs.insertOne(log as TreeLogsDocument);
    });
}

//#endregion 