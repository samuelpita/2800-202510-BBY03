import { findTreesClosestToCoord } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    return await findTreesClosestToCoord(50, -123)
        .then((docs) => {
            const treeSpecies: { species: string; distance: number }[] = [];
            for (const doc of docs)
                treeSpecies.push({
                    species: doc.species as string,
                    distance: doc.distance as number,
                });

            return {
                trees: treeSpecies,
            };
        })
        .catch((error) => {
            console.log(error);
        });
};
