import { MONGODB_DATABASE } from "$env/static/private";
import { ObjectId } from "mongodb";
import { startConnection } from "./mongo";
import type { Point } from "geojson";

/*

Sam's instructions:

If you're adding export functions/types to this file, make sure that
they fit their purpose in the code, in order to keep things neat.

If it's a type for the documents in the database, just add them under Types.
If it's collections related, add them to Collections.
If it's a CRUD function, add them to their respective comment below.

If you have any questions, or have problems with TypeScript/SvelteKit,
hit me up.

*/

// Types //

export type UserDocument = {
    email: string;
    password: string;
    username: string;
};

export type TreeDocument = {
	_id: ObjectId;
	imageUrl?: string;
	description?: string;
	location: Point;
	ageType?: string;
	species: string;
	name: string;
	height?: number;
	health?: string;
	plantedDate?: string;
};


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
