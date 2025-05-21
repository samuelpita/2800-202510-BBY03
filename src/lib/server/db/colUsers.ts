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

export function updateUser(userId: ObjectId | string, updateData: Partial<Omit<UserDocument, '_id'>>) {
    return getUsersCollection().then((users) => {
        return users.updateOne(
            { _id: ensureId(userId) },
            { $set: updateData }
        );
    });
}
