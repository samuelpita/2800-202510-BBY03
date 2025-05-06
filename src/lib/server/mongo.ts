import { MongoClient } from "mongodb";
import { MONGODB_URI } from "$env/static/private";

/*

Sam's Instructions:

Any functions related to Mongo-specific functionalities will end up here.
However, if it's a more general, CRUD-related function, place them in ```db.ts```.

*/

// MongoDB Functions //

const client = new MongoClient(MONGODB_URI);

export function startConnection() {
    return client.connect();
}

export function endConnection(force?: boolean) {
    return client.close(force);
}
