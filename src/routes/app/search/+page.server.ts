import { searchLocation, searchTreesNearPoint, searchTreeSpecies, searchUser } from "$lib/search";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
    const all = url.searchParams.get("all")?.trim();
    const location = url.searchParams.get("location")?.trim();
    const species = url.searchParams.get("species")?.trim();
    const user = url.searchParams.get("user")?.trim();

    if (all)
        return {
            treesResultArray: await searchTreesNearPoint(all, {
                speciesSearch: species,
                limit: 10,
            }),
        };
    else if (location) return { locationResultArray: await searchLocation(location) };
    else if (species)
        return { treeSpeciesResultArray: await searchTreeSpecies(species, { limit: 10 }) };
    else if (user) return { userResultArray: await searchUser(user, { limit: 10 }) };
};
