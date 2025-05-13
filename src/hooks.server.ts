import { stringStartsWithAny } from "$lib";
import { findUserId } from "$lib/server/db/colUsers";
import { endConnection } from "$lib/server/db/mongo";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    /*
        This checks the existence of authentication cookies, then sets the
        locals of the user's information accordingly.
    */

    const sessionId = event.cookies.get("sessionid");
    const userId = event.cookies.get("userid");

    if (sessionId && userId) {
        await findUserId(userId)
            .then((user) => {
                if (user)
                    event.locals.user = {
                        email: user.email,
                        username: user.username,
                    };
            })
            .finally(endConnection);
    } else {
        event.locals.user = null;
    }

    return await resolve(event);
};
