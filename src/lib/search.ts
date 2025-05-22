import {
    findTreesInBox,
    findTreesNearPoint,
    getTreeSpeciesCollection,
    type TreeOptionsInBox,
    type TreeOptionsNearPoint,
} from "./server/db/colTrees";
import { getUsersCollection } from "./server/db/colUsers";
import type { TreeSpeciesDocument } from "./server/db/types";
import type { Feature, FeatureCollection, Point, Position } from "geojson";
import type { Document } from "mongodb";

//#region Location Search - Nominatim API

export function searchLocation(text: string) {
    return fetch(
        `https://nominatim.openstreetmap.org/search?q=${text}&format=geojson&addressdetails=1`,
    )
        .then((response) => {
            return response.json() as Promise<FeatureCollection>;
        })
        .then((featureCollection) => {
            return featureCollection.features as LocationResult[];
        });
}

//#endregion

//#region Tree Search Functions

export type LocationProperties = {
    display_name: string;
    name: string;
    address: { [key: string]: string };
};

export type LocationResult = Feature<Point, LocationProperties>;

export type TreeResult = {
    _id: string;
    commonName: string;
    scientificName: string;
    distance?: number;
};

export type TreeSearchResult = { locationResult: LocationResult; treeResults: TreeResult[] }[];

export async function searchTreesNearPosition(
    coordinates: Position,
    options?: TreeOptionsNearPoint,
) {
    if (!options) options = {};
    if (!options.projectStage)
        options.projectStage = {
            _id: 1,
            "speciesInfo.commonName": 1,
            "speciesInfo.scientificName": 1,
            distance: 1,
        };

    const treeResults: TreeResult[] = [];
    const trees = await findTreesNearPoint(coordinates, options);

    for (const tree of trees) {
        treeResults.push({
            _id: tree._id.toString(),
            commonName: tree.speciesInfo.commonName.toLowerCase(),
            scientificName: tree.speciesInfo.scientificName.toLowerCase(),
            distance: tree.distance,
        });
    }

    return treeResults;
}

export async function searchTreesInBox(locationSearch: string, options?: TreeOptionsInBox) {
    if (!options) options = {};
    if (!options.projectStage)
        options.projectStage = {
            _id: 1,
            "speciesInfo.commonName": 1,
            "speciesInfo.scientificName": 1,
        };

    const locationResults = await searchLocation(locationSearch);
    const searchResults: TreeSearchResult = [];

    for (const locationResult of locationResults) {
        if (!locationResult.bbox) continue;

        const treeResults: TreeResult[] = [];
        const trees = await findTreesInBox(locationResult.bbox, options);

        for (const tree of trees) {
            treeResults.push({
                _id: tree._id.toString(),
                commonName: tree.speciesInfo.commonName.toLowerCase(),
                scientificName: tree.speciesInfo.scientificName.toLowerCase(),
            });
        }

        searchResults.push({ locationResult, treeResults });
    }

    return searchResults;
}

//#endregion

//#region Tree Species Search

export type TreeSpeciesSearchResult = TreeSpeciesDocument & { _id: string };

export function searchTreeSpecies(text: string, options?: { limit?: number }) {
    return getTreeSpeciesCollection().then((treeSpecies) => {
        if (!options) options = {};

        let pipeline: Document[] = [
            {
                $match: {
                    $text: {
                        $search: text,
                        $caseSensitive: false,
                    },
                },
            },
            {
                $project: {
                    _id: { $toString: "$_id" },
                    commonName: { $toLower: "$commonName" },
                    scientificName: { $toLower: "$scientificName" },
                },
            },
        ];

        if (options.limit) pipeline.push({ $limit: options.limit });

        return treeSpecies.aggregate<TreeSpeciesSearchResult>(pipeline).toArray();
    });
}

//#endregion

//#region User Search

export type UserSearchResult = { _id: string; dateJoined: Date; email: string; username: string };

export function searchUser(text: string, options?: { limit?: number; caseSensitive?: boolean }) {
    return getUsersCollection().then((users) => {
        if (!options) options = {};
        if (!options.caseSensitive) options.caseSensitive = false;

        let pipeline: Document[] = [
            {
                $match: {
                    $text: {
                        $search: text,
                        $caseSensitive: false,
                    },
                },
            },
            {
                $project: {
                    _id: { $toString: "$_id" },
                    dateJoined: 1,
                    email: 1,
                    username: 1,
                },
            },
        ];

        if (options.limit) pipeline.push({ $limit: options.limit });

        return users.aggregate<UserSearchResult>(pipeline).toArray();
    });
}

//#endregion
