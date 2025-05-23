import type { ReplaceType } from "$lib";
import type { TreeSpeciesGuideDocument } from "$lib/server/db";
import { getGuidesCollection } from "$lib/server/db/colGuides";
import type { ObjectId, WithId } from "mongodb";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const guides = await getGuidesCollection().then((guides) => {
        return guides
            .aggregate<ReplaceType<WithId<TreeSpeciesGuideDocument>, ObjectId, string>>([
                {
                    $match: { treeSpeciesId: { $exists: true } },
                },
                {
                    $addFields: {
                        _id: { $toString: "$_id" },
                        treeSpeciesId: { $toString: "$treeSpeciesId" },
                    },
                },
            ])
            .toArray();
    });

    return {
        guides,
    };
};
