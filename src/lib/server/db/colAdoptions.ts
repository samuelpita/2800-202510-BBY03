import { ensureId } from "./helper";
import { startConnection } from "./mongo";
import { MONGODB_DATABASE } from "$env/static/private";
import type { AdoptionDocument } from "./types";
import type { ObjectId } from "mongodb";

//#region Collection Functions

export function getAdoptionsCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection<AdoptionDocument>("adoptions");
    });
}

//#endregion

// Adoption CRUD //

export function insertAdoption(userId: ObjectId | string, treeId: ObjectId | string) {
    return getAdoptionsCollection().then((adoptions) => {
        return adoptions.insertOne({
            userId: ensureId(userId),
            treeId: ensureId(treeId),
            active: true,
            dateAdopted: new Date(),
        });
    });
}

export function findAdoptionsUserId(userId: ObjectId | string, limit?: number) {
    return getAdoptionsCollection().then((adoptions) => {
        if (limit)
            return adoptions
                .find({ userId: ensureId(userId) })
                .limit(limit)
                .toArray();
        return adoptions.find({ userId: ensureId(userId) }).toArray();
    });
}

export function findAdoptionsTreeId(treeId: ObjectId | string, limit?: number) {
    return getAdoptionsCollection().then((adoptions) => {
        if (limit)
            return adoptions
                .find({ treeId: ensureId(treeId) })
                .limit(limit)
                .toArray();
        return adoptions.find({ treeId: ensureId(treeId) }).toArray();
    });
}
