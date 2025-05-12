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

export type UserAchievementDocument = {
    user_id: ObjectId; 
    type: string;
    goal: number;
    value: number;
    completionDate: Date | null;
};

export type AdoptionDocument = {
    adoption_id?: ObjectId;
    user_id: ObjectId;
    tree_id: ObjectId;
    active: boolean;
    adoptionDate: Date;
};

export type ActionDocument = {
    action_id?: ObjectId;
    adoption_id: ObjectId;
    type: string;
    date: Date;
    details: string;
    tags: string[];
    completionDate: Date | null;
    creationDate: Date;
};

export type TreeStateDocument = {
    tree_state_id?: ObjectId;
    tree_id: ObjectId;
    age: number;
    stage: string;
    height: number;
    health: string;
    updated: Date;
};

// Collections //
export type TreeDocument = {
    location: Point;
    ageType: string;
    species: string;
    name: string;
    height: number;
};

// Users Collection //

export function getUsersCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection("users");
    });
}

export function getUserAchievementsCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection("user_achievements");
    });
}

export function getAdoptionsCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection("adoptions");
    });
}

export function getActionsCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection("actions");
    });
}

export function getTreeStatesCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection("tree_states");
    });
}

// Create //

export function insertUser(userDocument: UserDocument) {
    return getUsersCollection().then((users) => {
        return users.insertOne(userDocument);
    });
}

export function insertUserAchievement(achievement: UserAchievementDocument) {
    return getUserAchievementsCollection().then((achievements) => {
        return achievements.insertOne(achievement);
    });
}

export function insertAdoption(adoption: AdoptionDocument) {
    return getAdoptionsCollection().then((adoptions) => {
        return adoptions.insertOne(adoption);
    });
}

export function insertAction(action: ActionDocument) {
    return getActionsCollection().then((actions) => {
        return actions.insertOne(action);
    });
}

// Read //

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

export function findUserAchievementsByUserId(userId: ObjectId | string) {
    return getUserAchievementsCollection().then((achievements) => {
        const queryId = typeof userId === 'string' ? new ObjectId(userId) : userId;
        return achievements.find({ user_id: queryId }).toArray();
    });
}

export function findAdoptionsByUserId(userId: ObjectId | string) {
    return getAdoptionsCollection().then((adoptions) => {
        const queryId = typeof userId === 'string' ? new ObjectId(userId) : userId;
        return adoptions.find({ user_id: queryId, active: true }).toArray();
    });
}

export function findActionsByAdoptionId(adoptionId: ObjectId | string) {
    return getActionsCollection().then((actions) => {
        const queryId = typeof adoptionId === 'string' ? new ObjectId(adoptionId) : adoptionId;
        return actions.find({ adoption_id: queryId }).sort({ date: -1 }).toArray();
    });
}

// Update //
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

export function findTreeById(id: ObjectId | string) {
    return getTreesCollection().then((trees) => {
        const queryId = typeof id === 'string' ? new ObjectId(id) : id;
        return trees.findOne({ _id: queryId });
    });
}
