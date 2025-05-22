import {
    searchTreesInBox,
    searchTreesNearPosition,
    searchTreeSpecies,
    searchUser,
} from "$lib/search";
import { parseStringPosition } from "$lib/geolocation";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
    const all = url.searchParams.get("all")?.trim();
    const location = url.searchParams.get("location")?.trim();
    const species = url.searchParams.get("species")?.trim();
    const user = url.searchParams.get("user")?.trim();

    if (all != undefined) {
        const userCoordinates = url.searchParams.get("userCoordinates") as string;
        const radius = url.searchParams.get("radius") as string;

        return {
            treesNearPositionResults: await searchTreesNearPosition(
                parseStringPosition(userCoordinates),
                {
                    speciesSearch: all,
                    maxDistance: parseInt(radius) * 1000,
                    limit: 10,
                },
            ),
        };
    } else if (location) {
        return {
            treesInLocationResults: await searchTreesInBox(location, {
                speciesSearch: species,
                limit: 10,
            }),
        };
    } else if (species)
        return { treeSpeciesResultArray: await searchTreeSpecies(species, { limit: 10 }) };
    else if (user) return { userResultArray: await searchUser(user, { limit: 10 }) };
};
