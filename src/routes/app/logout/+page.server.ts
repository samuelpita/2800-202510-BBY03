import { deleteAuthCookies } from "$lib/server/authentication";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies, locals }) => {
    if (locals.user) deleteAuthCookies(cookies);
    throw redirect(303, "/app/login");
};
