import { deleteAuthCookies } from "$lib/server/authentication";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
    const sessionId = cookies.get("sessionid");
    const userId = cookies.get("userId");

    if (sessionId && userId) deleteAuthCookies(cookies);
    throw redirect(303, "/login");
};
