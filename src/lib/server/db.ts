import { MONGODB_DATABASE } from "$env/static/private";
import { ObjectId, type Document, type Filter } from "mongodb";
import { startConnection } from "./mongo";
import type { TreeDocument, UserDocument } from "./dbTypes";

/*
    Sam's instructions:

    If you're adding export functions/types to this file, make sure that
    they fit their purpose in the code, in order to keep things neat.

    If it's a type for the documents in the database, add them in dbTypes.ts.
    If it's collections related, add them to Collections.
    If it's a CRUD function, add them to their respective comment below.

    If you have any questions, or have problems with TypeScript/SvelteKit,
    hit me up.
*/

// Helper functions //

export function ensureId(id: ObjectId | string) {
    if (typeof id == "string") return new ObjectId(id);
    return id;
}

// Adoption Collection //

export function getAdoptionCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection("adoption");
    });
}

/**
 * This function will attempt to adopt a tree with the given user and tree ids,
 * and if the relationship doesn't exist in the collection, it will create a
 * new one. Otherwise
 */
export function adoptTree(userId: ObjectId | string, treeId: ObjectId | string) {
    return getAdoptionCollection().then(async (adoptions) => {
        const adoptionDoc = await adoptions.findOne({
            userId: ensureId(userId),
            treeId: ensureId(treeId),
        });

        if (!adoptionDoc)
            return adoptions.insertOne({
                userId,
                treeId,
                active: true,
                adoptionDate: { $setOnInsert: new Date() },
            });

        return null;
    });
}

export function updateAdoptionNickname(userId: ObjectId, treeId: ObjectId, nickname: string) {
    return getAdoptionCollection().then((adoptions) => {
        return adoptions.updateOne(
            {
                userId,
                treeId,
            },
            {
                $set: {
                    nickname,
                },
            },
        );
    });
}

// Users Collection //

export function getUsersCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection("users");
    });
}

export function insertUser(userDocument: UserDocument) {
    return getUsersCollection().then((users) => {
        return users.insertOne(userDocument);
    });
}

export function findUserByEmail(email: string) {
    return getUsersCollection().then((users) => {
        return users.findOne({ email });
    });
}

export function findUserById(id: ObjectId | string) {
    return getUsersCollection().then((users) => {
        if (typeof id == "string") return users.findOne({ _id: new ObjectId(id) });
        return users.findOne({ _id: id });
    });
}

// TreeStats Collection //

export function getTreeStatsCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection("treeStats");
    });
}

// TreeSpecies Collection //

export function getTreeSpeciesCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection("treeSpecies");
    });
}

export function findTreeSpeciesScientific(query: string, caseSensitive: boolean = false) {
    return getTreeSpeciesCollection().then((treeSpecies) => {
        const filter: Filter<Document> = {
            $text: {
                $search: query,
                $caseSensitive: caseSensitive,
            },
        };
        return treeSpecies.findOne(filter);
    });
}

// Trees Collection //

export function getTreesCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection("trees");
    });
}

export function insertTree(treeDocument: TreeDocument) {
    return getTreesCollection().then((trees) => {
        return trees.insertOne(treeDocument);
    });
}

export function findTreeById(treeId: ObjectId) {
    return getTreesCollection().then((trees) => {
        return trees.findOne({ _id: treeId });
    });
}

export function findTreesClosestToCoord(
    lat: number,
    long: number,
    options?: { limit?: number; maxDistance?: number },
) {
    return getTreesCollection().then((trees) => {
        if (!options) options = {};

        // Set limit to 10 trees, if not specified.
        if (!options.limit) options.limit = 10;

        // Set maxDistance to 50 kilometers by default.
        if (!options.maxDistance) options.maxDistance = 50 * 1000;

        return trees
            .aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [long, lat],
                        },
                        distanceField: "distance",
                        spherical: true,
                        maxDistance: options.maxDistance,
                    },
                },
                { $sort: { distanceToCenter: 1 } },
            ])
            .limit(options.limit)
            .toArray();
    });
}
