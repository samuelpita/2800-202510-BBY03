import { ensureId } from "./helper";
import { startConnection } from "./mongo";
import { MONGODB_DATABASE } from "$env/static/private";
import type { ObjectId } from "mongodb";
import type { UserDocument } from "./types";

//#region Collection Functions

export function getUsersCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection<UserDocument>("users");
    });
}

//#endregion

// User CRUD //

export function findUserId(id: ObjectId | string, toStringId = false) {
    return getUsersCollection().then((users) => {
        return users.findOne({ _id: ensureId(id) }).then((doc) => {
            if (doc) {
                if (toStringId)
                    return {
                        ...doc,
                        _id: doc._id.toString(),
                    };

                return doc;
            }
        });
    });
}

export function findUserEmail(email: string) {
    return getUsersCollection().then((users) => {
        return users.findOne({ email });
    });
}

export function insertUser(email: string, password: string, username: string) {
    return getUsersCollection().then((users) => {
        return users.insertOne({
            email,
            password,
            username,
            dateJoined: new Date(),
        });
    });
}
