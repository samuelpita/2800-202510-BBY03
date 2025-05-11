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

export function findUserId(id: ObjectId | string) {
    return getUsersCollection().then((users) => {
        return users.findOne({ _id: ensureId(id) });
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

export function searchUser(text: string, options?: { limit?: number; caseSensitive?: boolean }) {
    return getUsersCollection().then((users) => {
        if (!options) options = {};
        if (!options.limit) options.limit = 10;
        if (!options.caseSensitive) options.caseSensitive = false;

        return users
            .find({
                $text: {
                    $search: text,
                    $caseSensitive: options.caseSensitive,
                },
            })
            .limit(options.limit)
            .toArray();
    });
}
