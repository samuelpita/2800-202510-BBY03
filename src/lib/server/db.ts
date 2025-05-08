import { MONGODB_DATABASE } from "$env/static/private";
import {
    ObjectId,
    type Abortable,
    type AggregateOptions,
    type Document,
    type Filter,
    type WithId,
} from "mongodb";
import { startConnection } from "./mongo";
import type { BBox } from "geojson";
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
        return client.db(MONGODB_DATABASE).collection("adoptions");
    });
}

export function isTreeAdopted(userId: ObjectId | string, treeId: ObjectId | string) {
    return getAdoptionCollection().then((adoptions) => {
        return adoptions.findOne({
            userId: ensureId(userId),
            treeId: ensureId(treeId),
        });
    });
}

export function adoptTree(userId: ObjectId | string, treeId: ObjectId | string) {
    return getAdoptionCollection().then(async (adoptions) => {
        if (!(await isTreeAdopted(userId, treeId)))
            return adoptions.insertOne({
                userId: ensureId(userId),
                treeId: ensureId(treeId),
                active: true,
                dateAdopted: { $setOnInsert: new Date() },
            });

        return null;
    });
}

export function setAdoptionNickname(userId: ObjectId, treeId: ObjectId, nickname: string) {
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

export function findUserEmail(email: string) {
    return getUsersCollection().then((users) => {
        return users.findOne({ email });
    });
}

export function findUserId(id: ObjectId | string) {
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

export function findTreeStats(treeId: ObjectId | string) {
    return getTreeStatsCollection().then((treeStats) => {
        return treeStats.findOne({ treeId: ensureId(treeId) });
    });
}

// TreeSpecies Collection //

export function getTreeSpeciesCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection("treeSpecies");
    });
}

export function findTreeSpeciesId(id: ObjectId | string) {
    return getTreeSpeciesCollection().then((treeSpecies) => {
        return treeSpecies.findOne({ _id: ensureId(id) });
    });
}

export function findTreeSpeciesIdMatching(searchTerm: string, limit?: number) {
    return getTreeSpeciesCollection()
        .then((treeSpecies) => {
            if (!limit) limit = 10;

            const filter: Filter<Document> = {
                $text: {
                    $search: searchTerm,
                    $caseSensitive: false,
                },
            };
            return treeSpecies
                .find(filter, { projection: { _id: 1 } })
                .limit(limit)
                .toArray();
        })
        .then((docs) => {
            return docs.map((species) => species._id);
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

export function findTreesAggregate(
    pipeline?: Document[],
    options?: AggregateOptions & Abortable,
    limit?: number,
) {
    return getTreesCollection().then((trees) => {
        if (!limit) limit = 10;
        return trees.aggregate(pipeline, options).limit(limit).toArray();
    });
}

export function findTreeId(treeId: ObjectId) {
    return getTreesCollection().then((trees) => {
        return trees.findOne({ _id: treeId });
    });
}

export function findTreesInBox(bbox: BBox, options?: { limit?: number }) {
    return getTreesCollection().then((trees) => {
        if (!options) options = {};
        if (!options.limit) options.limit = 10;

        return trees
            .find({
                location: {
                    $geoWithin: {
                        $box: [
                            [bbox[0], bbox[1]],
                            [bbox[2], bbox[3]],
                        ],
                    },
                },
            })
            .limit(options.limit)
            .toArray();
    });
}

export function findTreesInBoxSpecies(species: string, bbox: BBox, options?: { limit?: number }) {
    return getTreesCollection().then(async (trees) => {
        if (!options) options = {};
        if (!options.limit) options.limit = 10;

        let pipeline: Document[];
        const matchingSpecies = await findTreeSpeciesIdMatching(species, options.limit);

        const matchFilter = {
            $match: {
                location: {
                    $geoWithin: {
                        $box: [
                            [bbox[0], bbox[1]],
                            [bbox[2], bbox[3]],
                        ],
                    },
                },
            },
        };

        const matchSpeciesFilter = {
            $match: {
                treeSpeciesId: { $in: matchingSpecies },
            },
        };

        const limitFilter = {
            $limit: options.limit,
        };

        if (species) pipeline = [matchFilter, matchSpeciesFilter, limitFilter];
        else pipeline = [matchFilter, limitFilter];

        return trees.aggregate(pipeline).toArray();
    });
}

export function findTreesNearby(
    lat: number,
    long: number,
    options?: { limit?: number; maxDistance?: number },
) {
    return getTreesCollection().then((trees) => {
        if (!options) options = {};
        if (!options.limit) options.limit = 10;
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
                        maxDistance: options.maxDistance,
                        spherical: true,
                    },
                },
                { $sort: { distanceToCenter: 1 } },
            ])
            .limit(options.limit)
            .toArray();
    });
}

export function findTreesNearbySpecies(
    species: string,
    lat: number,
    long: number,
    options?: { limit?: number; maxDistance?: number },
) {
    return getTreesCollection().then(async (trees) => {
        if (!options) options = {};
        if (!options.limit) options.limit = 10;
        if (!options.maxDistance) options.maxDistance = 50 * 1000;

        let pipeline: Document[];
        const matchingSpecies = await findTreeSpeciesIdMatching(species, options.limit);

        const geoNearFilter = {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [long, lat],
                },
                distanceField: "distance",
                maxDistance: options.maxDistance,
                spherical: true,
            },
        };
        const matchSpeciesFilter = {
            $match: {
                treeSpeciesId: { $in: matchingSpecies },
            },
        };
        const limitFilter = {
            $limit: options.limit,
        };

        if (matchingSpecies.length != 0)
            pipeline = [geoNearFilter, matchSpeciesFilter, limitFilter];
        else pipeline = [geoNearFilter, limitFilter];

        return trees.aggregate(pipeline).toArray();
    });
}
