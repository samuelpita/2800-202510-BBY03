import type { Feature, FeatureCollection, Geometry, Point } from "geojson";
import {
    findTreesInBox,
    findTreesNearPoint,
    type TreeOptionsInBox,
    type TreeOptionsNearPoint,
} from "./server/db/colTrees";

//#region Functions that interface with Nominatim API

export function searchLocation<TGeometry extends Geometry, TProperties>(text: string) {
    return fetch(
        `https://nominatim.openstreetmap.org/search?q=${text}&format=geojson&addressdetails=1`,
    )
        .then((response) => {
            return response.json() as Promise<FeatureCollection>;
        })
        .then((featureCollection) => {
            return featureCollection.features as Feature<TGeometry, TProperties>[];
        });
}

//#endregion

//#region Tree Search Types

export type LocationProperties = {
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

//#endregion

//#region Tree Search Functions

export async function searchTreesNearPoint(locationSearch: string, options?: TreeOptionsNearPoint) {
    if (!options) options = {};
    if (!options.projectStage)
        options.projectStage = {
            _id: 1,
            "speciesInfo.commonName": 1,
            "speciesInfo.scientificName": 1,
            distance: 1,
        };

    const locationResults = await searchLocation<Point, LocationProperties>(locationSearch);
    const searchResults: { locationResult: LocationResult; treeResults: TreeResult[] }[] = [];

    for (const locationResult of locationResults) {
        const treeResults: TreeResult[] = [];
        const trees = await findTreesNearPoint(locationResult.geometry.coordinates, options);

        for (const tree of trees) {
            treeResults.push({
                _id: tree._id.toString(),
                commonName: tree.speciesInfo.commonName,
                scientificName: tree.speciesInfo.scientificName,
                distance: tree.distance,
            });
        }

        searchResults.push({ locationResult, treeResults });
    }

    return searchResults;
}

export async function searchTreesInBox(locationSearch: string, options?: TreeOptionsInBox) {
    if (!options) options = {};
    if (!options.projectStage)
        options.projectStage = {
            _id: 1,
            "speciesInfo.commonName": 1,
            "speciesInfo.scientificName": 1,
        };

    const locationResults = await searchLocation<Point, LocationProperties>(locationSearch);
    const searchResults: { locationResult: LocationResult; treeResults: TreeResult[] }[] = [];

    for (const locationResult of locationResults) {
        if (!locationResult.bbox) continue;

        const treeResults: TreeResult[] = [];
        const trees = await findTreesInBox(locationResult.bbox, options);

        for (const tree of trees) {
            treeResults.push({
                _id: tree._id.toString(),
                commonName: tree.speciesInfo.commonName,
                scientificName: tree.speciesInfo.scientificName,
            });
        }

        searchResults.push({ locationResult, treeResults });
    }

    return searchResults;
}

//#endregion
