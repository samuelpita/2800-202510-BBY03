import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
    const sessionId = cookies.get("sessionid");
    const userId = cookies.get("userid");

    if (!(sessionId && userId)) throw redirect(303, "/login");
};
