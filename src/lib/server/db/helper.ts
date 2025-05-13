import { ObjectId } from "mongodb";

export function ensureId(id: ObjectId | string) {
    if (typeof id == "string") return new ObjectId(id);
    return id;
}
