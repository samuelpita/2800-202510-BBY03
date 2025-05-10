import { ensureId } from "./helper";
import { startConnection } from "./mongo";
import { MONGODB_DATABASE } from "$env/static/private";
import type { TreeDocument, TreeSpeciesDocument } from "./types";
import type { Document, ObjectId } from "mongodb";
import type { BBox, Point, Position } from "geojson";

//#region Collection Functions

export function getTreesCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection<TreeDocument>("trees");
    });
}

export function getTreeSpeciesCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection<TreeSpeciesDocument>("treeSpecies");
    });
}

//#endregion

// TreeSpecies CRUD //

export function findTreeSpeciesId(id: ObjectId | string) {
    return getTreeSpeciesCollection().then((treeSpecies) => {
        return treeSpecies.findOne({ _id: ensureId(id) });
    });
}

//#region TreeSpecies Searching

export function searchTreeSpecies(search: string, options?: { limit?: number }) {
    return getTreeSpeciesCollection().then((treeSpecies) => {
        if (!options) options = {};
        if (!options.limit) options.limit = 10;

        return treeSpecies
            .find({
                $text: {
                    $search: `"${search}"`,
                    $caseSensitive: false,
                },
            })
            .limit(options.limit)
            .toArray();
    });
}

//#endregion

// Tree CRUD //

export function findTreeId(id: ObjectId | string) {
    return getTreesCollection().then((trees) => {
        return trees.findOne({ _id: ensureId(id) });
    });
}

export function insertTree(treeSpeciesId: ObjectId | string, location: Point, datePlanted: Date) {
    return getTreesCollection().then((trees) => {
        return trees.insertOne({
            treeSpeciesId: ensureId(treeSpeciesId),
            location,
            datePlanted,
            dateCreated: new Date(),
        });
    });
}

//#region Tree Searching

const speciesInfoPipeline: Document[] = [
    {
        $lookup: {
            from: "treeSpecies",
            localField: "treeSpeciesId",
            foreignField: "_id",
            as: "speciesInfoArray",
        },
    },
    {
        $unwind: {
            path: "$speciesInfoArray",
            preserveNullAndEmptyArrays: false,
        },
    },
    {
        $addFields: {
            speciesInfo: "$speciesInfoArray",
        },
    },
    {
        $project: {
            speciesInfoArray: 0,
        },
    },
];

/**
 * Find trees closest to a set of coordinates.
 */
export function findTreesNearPoint(
    coordinates: Position,
    options?: { limit?: number; maxDistance?: number; speciesSearch?: string },
) {
    return getTreesCollection().then(async (trees) => {
        if (!options) options = {};
        if (!options.limit) options.limit = 10;
        if (!options.maxDistance) options.maxDistance = 10 * 1000;

        let pipeline: Document[] = [];

        pipeline.push({
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates,
                },
                distanceField: "distance",
                maxDistance: options.maxDistance,
                spherical: true,
            },
        });

        if (options.speciesSearch) {
            const matchingSpecies = await searchTreeSpecies(options.speciesSearch, {
                limit: options.limit,
            });

            pipeline.push(
                {
                    $match: {
                        treeSpeciesId: { $in: matchingSpecies },
                    },
                },
                ...speciesInfoPipeline,
            );
        }

        pipeline.push({
            $limit: options.limit,
        });

        return trees.aggregate(pipeline).toArray();
    });
}

/**
 * Find trees within a bounding box.
 */
export function findTreesInBox(bbox: BBox, options?: { limit?: number; speciesSearch?: string }) {
    return getTreesCollection().then(async (trees) => {
        if (!options) options = {};
        if (!options.limit) options.limit = 10;

        let pipeline: Document[] = [];

        pipeline.push({
            $match: {
                location: {
                    $geoWithin: {
                        $box: bbox,
                    },
                },
            },
        });

        if (options.speciesSearch) {
            const matchingSpecies = await searchTreeSpecies(options.speciesSearch, {
                limit: options.limit,
            });

            pipeline.push(
                {
                    $match: {
                        treeSpeciesId: { $in: matchingSpecies },
                    },
                },
                ...speciesInfoPipeline,
            );
        }

        pipeline.push({
            $limit: options.limit,
        });

        return trees.aggregate(pipeline).toArray();
    });
}

//#endregion
