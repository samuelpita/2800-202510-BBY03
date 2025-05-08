import type { Document, WithId } from "mongodb";
import type { PageServerLoad } from "./$types";
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry, Point } from "geojson";
import { findTreesNearby, findTreesNearbySpecies, findTreeSpeciesId } from "$lib/server/db";
import { getTreeSearchResults } from "$lib/search";

export const load: PageServerLoad = async ({ url }) => {
    // const species = url.searchParams.get("species")?.trim();
    // const location = url.searchParams.get("location")?.trim();
    // const query: any = {};
    // if (species) query.species = { $regex: new RegExp(species, "i") };
    // if (location) query.location = { $regex: new RegExp(location, "i") };
    // let trees: TreeDocument[] = [];
    // try {
    //     const treesCollection = await getTreesCollection();
    //     trees = (await treesCollection.find(query).toArray()) as TreeDocument[];
    // } catch (err) {
    //     console.error("Error fetching trees:", err);
    // }
    // return {
    //     trees: trees.map((tree) => ({
    //         _id: tree._id.toString(),
    //         name: tree.name,
    //         species: tree.species,
    //         location: tree.location,
    //         imageUrl: tree.imageUrl || null,
    //     })),
    //     searched: Boolean(species || location),
    // };

    const search = url.searchParams.get("search")?.trim();
    const species = url.searchParams.get("species")?.trim();

    if (!search) return;

    // Set up types
    // type LocationResult = Feature<Geometry, GeoJsonProperties>;
    // type TreeResult = {
    //     id: string;
    //     commonName: string;
    //     scientificName: string;
    //     distance: number;
    // };

    // const searchResults: { locationResult: LocationResult; treeResults: TreeResult[] }[] = [];

    // for (const locationResult of locationResults) {
    //     const geometry = locationResult.geometry as Point;
    //     const [long, lat] = geometry.coordinates;

    //     if (locationResult.properties) {
    //         const locationName = locationResult.properties.display_name as string;

    //         let trees: WithId<Document>[];
    //         let treeResults: TreeResult[] = [];

    //         if (species)
    //             trees = (await findTreesNearbySpecies(species, lat, long)) as WithId<Document>[];
    //         else trees = (await findTreesNearby(lat, long)) as WithId<Document>[];

    //         for (const tree of trees) {
    //             const treeSpecies = await findTreeSpeciesId(tree.treeSpeciesId);
    //             if (!treeSpecies) continue;

    //             treeResults.push({
    //                 id: tree._id.toString(),
    //                 commonName: treeSpecies.commonName,
    //                 scientificName: treeSpecies.scientificName,
    //                 distance: tree.distance,
    //             });
    //         }

    //         searchResults.push({ locationResult, treeResults });
    //     }
    // }

    return {
        searchResults: await getTreeSearchResults(search, species),
    };
};
