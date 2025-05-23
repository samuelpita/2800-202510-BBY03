import { MongoClient } from "mongodb";
import { MONGODB_URI } from "$env/static/private";

const client = new MongoClient(MONGODB_URI);

export function startConnection() {
    return new Promise<MongoClient>((resolve) => resolve(client));
}

export function endConnection(force?: boolean) {
    return client.close(force);
}
