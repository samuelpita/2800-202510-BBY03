import { ensureId } from "./helper";
import { startConnection } from "./mongo";
import { MONGODB_DATABASE } from "$env/static/private";
import type { TreeDocument, TreeSpeciesDocument } from "./types";
import type { Document, ObjectId, WithId } from "mongodb";
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

//#region TreeSpecies CRUD

export function findTreeSpeciesId(id: ObjectId | string) {
    return getTreeSpeciesCollection().then((treeSpecies) => {
        return treeSpecies.findOne({ _id: ensureId(id) });
    });
}

/**
 * Returns an array of IDs of Tree Species documents that match the given
 * text search parameter.
 */
export function searchTreeSpeciesIdArray(text: string, options?: { limit?: number }) {
    return getTreeSpeciesCollection()
        .then((treeSpecies) => {
            if (!options) options = {};

            let pipeline: Document[] = [];

            pipeline.push({
                $match: {
                    $text: {
                        $search: `"${text}"`,
                        $caseSensitive: false,
                    },
                },
            });

            if (options.limit) pipeline.push({ $limit: options.limit });

            pipeline.push(
                {
                    $group: {
                        _id: null,
                        ids: { $addToSet: "$_id" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                    },
                },
            );

            return treeSpecies.aggregate<{ ids: ObjectId[] }>(pipeline).toArray();
        })
        .then((aggregate) => {
            return aggregate[0].ids;
        });
}

//#endregion

//#region Tree CRUD

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

//#region Tree Searching Types & Constants

export type TreeAggregateNearPoint = WithId<TreeDocument> & {
    distance: number;
    speciesInfo: WithId<TreeSpeciesDocument>;
};

export type TreeAggregateInBox = WithId<TreeDocument> & {
    speciesInfo: WithId<TreeSpeciesDocument>;
};

export type TreeOptionsNearPoint = {
    limit?: number;
    maxDistance?: number;
    projectStage?: { [key: string]: any };
    speciesSearch?: string;
};

export type TreeOptionsInBox = {
    limit?: number;
    projectStage?: { [key: string]: any };
    speciesSearch?: string;
};

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

//#endregion

//#region Tree Searching

/**
 * Find trees closest to a set of coordinates.
 */
export function findTreesNearPoint(coordinates: Position, options?: TreeOptionsNearPoint) {
    return getTreesCollection().then(async (trees) => {
        if (!options) options = {};
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
            const matchingSpecies = await searchTreeSpeciesIdArray(options.speciesSearch, {
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
        } else {
            pipeline.push(...speciesInfoPipeline);
        }

        if (options.projectStage) pipeline.push({ $project: options.projectStage });

        if (options.limit)
            pipeline.push({
                $limit: options.limit,
            });

        return trees.aggregate<TreeAggregateNearPoint>(pipeline).toArray();
    });
}

/**
 * Find trees within a bounding box.
 */
export function findTreesInBox(bbox: BBox, options?: TreeOptionsInBox) {
    return getTreesCollection().then(async (trees) => {
        if (!options) options = {};

        let pipeline: Document[] = [];

        pipeline.push({
            $match: {
                location: {
                    $geoWithin: {
                        $box: [
                            [bbox[0], bbox[1]],
                            [bbox[2], bbox[3]],
                        ],
                    },
                },
            },
        });

        if (options.speciesSearch) {
            const matchingSpecies = await searchTreeSpeciesIdArray(options.speciesSearch, {
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
        } else {
            pipeline.push(...speciesInfoPipeline);
        }

        if (options.projectStage) pipeline.push({ $project: options.projectStage });

        if (options.limit)
            pipeline.push({
                $limit: options.limit,
            });

        return trees.aggregate<TreeAggregateInBox>(pipeline).toArray();
    });
}

//#endregion

//#endregion
