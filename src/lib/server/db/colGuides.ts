import { ensureId } from "./helper";
import { startConnection } from "./mongo";
import { MONGODB_DATABASE } from "$env/static/private";
import type { GuideDocument, TreeSpeciesGuideDocument } from "./types";
import { ObjectId, type WithId } from "mongodb";

//#region Collection Functions

export function getGuidesCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection<GuideDocument>("guides");
    });
}

export function getTreeSpeciesGuideCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection<TreeSpeciesGuideDocument>("guides");
    });
}

//#endregion

//#region General Guide CRUD

export function findGuideId(id: ObjectId | string, toStringId = false) {
    return getGuidesCollection().then((guides) => {
        return guides.findOne({ _id: ensureId(id) }).then((doc) => {
            if (doc) {
                if (toStringId)
                    return {
                        ...doc,
                        _id: doc._id.toString(),
                        userId: doc.userId ? doc.userId.toString() : undefined,
                    };

                return doc;
            }
        });
    });
}

export function insertGuide(title: string, content: string, userId?: ObjectId | string) {
    return getGuidesCollection().then((guides) => {
        if (userId)
            return guides.insertOne({
                title,
                content,
                dateCreated: new Date(),
                userId: ensureId(userId),
            });

        return guides.insertOne({ title, content, dateCreated: new Date() });
    });
}

//#endregion

//#region Tree Species Guide CRUD

export function findTreeSpeciesGuide(treeSpeciesId: ObjectId | string, toStringId = false) {
    return getTreeSpeciesGuideCollection().then((treeSpeciesGuides) => {
        return treeSpeciesGuides.findOne({ treeSpeciesId: ensureId(treeSpeciesId) }).then((doc) => {
            if (doc) {
                if (toStringId)
                    return {
                        ...doc,
                        _id: doc._id.toString(),
                        treeSpeciesId: doc._id.toString(),
                        userId: doc.userId ? doc.userId.toString() : undefined,
                    };

                return doc;
            }
        });
    });
}

export function insertTreeSpeciesGuide(
    title: string,
    content: string,
    treeSpeciesId: ObjectId | string,
    userId?: ObjectId | string,
) {
    return getTreeSpeciesGuideCollection().then((treeSpeciesGuides) => {
        if (userId)
            return treeSpeciesGuides.insertOne({
                title,
                content,
                dateCreated: new Date(),
                treeSpeciesId: ensureId(treeSpeciesId),
                userId: ensureId(userId),
            });

        return treeSpeciesGuides.insertOne({
            title,
            content,
            dateCreated: new Date(),
            treeSpeciesId: ensureId(treeSpeciesId),
        });
    });
}

//#endregion
