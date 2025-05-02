import { MONGODB_DATABASE } from "$env/static/private";
import { ObjectId } from "mongodb";
import { startConnection } from "./mongo";

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

// Collections //

export function getUsersCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection("users");
    });
}

// Create //

export function insertUser(userDocument: UserDocument) {
    return getUsersCollection().then((users) => {
        return users.insertOne(userDocument);
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

// Update //

// Delete //
