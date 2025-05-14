import { findTreeSpeciesGuide } from "$lib/server/db/colGuides";
import { error } from "@sveltejs/kit";
import { findTreeSpeciesId } from "$lib/server/db/colTrees";
import { findUserId } from "$lib/server/db/colUsers";
import { compileMarkdown, stringifyObjectIds } from "$lib";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const { id } = params;

    const speciesInfo = await findTreeSpeciesId(id).then((doc) => {
        if (doc) return stringifyObjectIds(doc);
        error(404);
    });

    const guide = await findTreeSpeciesGuide(id)
        .then((possibleDoc) => {
            if (possibleDoc) return possibleDoc;
            error(404);
        })
        .then(async (doc) => {
            const content = await compileMarkdown(doc.content)
                .then((result) => result.code)
                .catch((error) => {
                    error(404, error);
                });

            return {
                ...stringifyObjectIds(doc),
                content,
            };
        });

    let author: string = "Lorax";

    if (guide.userId)
        await findUserId(guide.userId).then((doc) => {
            if (doc) author = doc.username;
        });

    return {
        author,
        guide,
        speciesInfo,
    };
};
