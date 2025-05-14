import { findTreeSpeciesGuide } from "$lib/server/db/colGuides";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { findTreeSpeciesId } from "$lib/server/db/colTrees";
import { findUserId } from "$lib/server/db/colUsers";
import { compileMarkdown } from "$lib";

export const load: PageServerLoad = async ({ params }) => {
    const { id } = params;

    const speciesInfo = await findTreeSpeciesId(id, true).then((doc) => {
        if (doc) return doc;
        error(404);
    });

    const guide = await findTreeSpeciesGuide(id, true)
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
                ...doc,
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
