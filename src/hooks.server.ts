import { stringStartsWithAny } from "$lib";
import { findUserById } from "$lib/server/db";
import { endConnection } from "$lib/server/mongo";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    if (stringStartsWithAny(event.url.pathname, "/app", "/login", "/logout", "/register")) {
        const sessionId = event.cookies.get("sessionid");
        const userId = event.cookies.get("userid");

        if (sessionId && userId) {
            await findUserById(userId)
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
    }

    return await resolve(event);
};
