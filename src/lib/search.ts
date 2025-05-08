import { findTreesNearbySpecies, findTreesNearby, findTreeSpeciesId } from "$lib/server/db";
import type { Feature, Geometry, GeoJsonProperties, FeatureCollection, Point } from "geojson";
import type { WithId, Document } from "mongodb";

export type LocationResult = Feature<Geometry, GeoJsonProperties>;

export type TreeResult = {
    id: string;
    commonName: string;
    scientificName: string;
    distance: number;
};

export async function getTreeSearchResults(search: string, species?: string) {
    const locationFetchUrl = `https://nominatim.openstreetmap.org/search?q=${search}&format=geojson`;
    const locationResults = await fetch(locationFetchUrl)
        .then((response) => {
            return response.json() as Promise<FeatureCollection>;
        })
        .then((result) => {
            return result.features;
        });

    const searchResults: { locationResult: LocationResult; treeResults: TreeResult[] }[] = [];

    for (const locationResult of locationResults) {
        const geometry = locationResult.geometry as Point;
        const [long, lat] = geometry.coordinates;

        if (locationResult.properties) {
            const locationName = locationResult.properties.display_name as string;

            let trees: WithId<Document>[];
            let treeResults: TreeResult[] = [];

            if (species)
                trees = (await findTreesNearbySpecies(species, lat, long)) as WithId<Document>[];
            else trees = (await findTreesNearby(lat, long)) as WithId<Document>[];

            for (const tree of trees) {
                const treeSpecies = await findTreeSpeciesId(tree.treeSpeciesId);
                if (!treeSpecies) continue;

                treeResults.push({
                    id: tree._id.toString(),
                    commonName: treeSpecies.commonName,
                    scientificName: treeSpecies.scientificName,
                    distance: tree.distance,
                });
            }

            searchResults.push({ locationResult, treeResults });
        }
    }

    return searchResults;
}
