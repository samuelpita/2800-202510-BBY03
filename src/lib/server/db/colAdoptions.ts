import { ensureId } from "./helper";
import { startConnection } from "./mongo";
import { MONGODB_DATABASE } from "$env/static/private";
import type { AdoptionDocument } from "./types";
import type { ObjectId } from "mongodb";

//#region Collection Functions

export function getAdoptionsCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection<AdoptionDocument>("adoptions");
    });
}

//#endregion

// Adoption CRUD //

export function insertAdoption(userId: ObjectId | string, treeId: ObjectId | string) {
    return getAdoptionsCollection().then((adoptions) => {
        return adoptions.insertOne({
            userId: ensureId(userId),
            treeId: ensureId(treeId),
            active: true,
            dateAdopted: new Date(),
        });
    });
}

export function findAdoptionsUserId(userId: ObjectId | string, limit?: number) {
    return getAdoptionsCollection().then((adoptions) => {
        if (limit)
            return adoptions
                .find({ userId: ensureId(userId) })
                .limit(limit)
                .toArray();
        return adoptions.find({ userId: ensureId(userId) }).toArray();
    });
}

export function findAdoptionsTreeId(treeId: ObjectId | string, limit?: number) {
    return getAdoptionsCollection().then((adoptions) => {
        if (limit)
            return adoptions
                .find({ treeId: ensureId(treeId) })
                .limit(limit)
                .toArray();
        return adoptions.find({ treeId: ensureId(treeId) }).toArray();
    });
}

export async function adoptTree(userId: ObjectId | string, treeId: ObjectId | string) {
    return getAdoptionsCollection().then((adoptions) => {
        return adoptions.findOne({
            userId: ensureId(userId),
            treeId: ensureId(treeId),
            active: true
        }).then((existingAdoption) => {
            if (existingAdoption) {
                return { success: false, message: "You have already adopted this tree", adoption: existingAdoption };
            }
            
            return insertAdoption(userId, treeId).then((result) => {
                if (result.acknowledged) {
                    return { success: true, message: "Tree adopted successfully", adoptionId: result.insertedId };
                } else {
                    return { success: false, message: "Failed to adopt tree" };
                }
            });
        });
    });
}

export async function getAdoptedTrees(userId: ObjectId | string) {
    const client = await startConnection();
    const db = client.db(MONGODB_DATABASE);
    
    // Get all active adoptions for the user
    const adoptions = db.collection<AdoptionDocument>("adoptions");
    const trees = db.collection("trees");
    const species = db.collection("treeSpecies");
    
    const userAdoptions = await adoptions.find({
        userId: ensureId(userId),
        active: true
    }).toArray();
    
    // For each adoption, get the tree details and species info
    const adoptedTrees = await Promise.all(
        userAdoptions.map(async (adoption) => {
            const tree = await trees.findOne({ _id: adoption.treeId });
            
            if (tree && tree.treeSpeciesId) {
                const speciesInfo = await species.findOne({ _id: tree.treeSpeciesId });
                
                return {
                    adoption,
                    tree: {
                        ...tree,
                        speciesInfo
                    }
                };
            }
            
            return { adoption, tree };
        })
    );
    
    return adoptedTrees;
}

//#endregion