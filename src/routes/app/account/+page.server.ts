import { redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
    const sessionId = cookies.get("sessionid");
    const userId = cookies.get("userid");

    if (!(sessionId && userId)) throw redirect(303, "/login");
};

export const actions: Actions = {
    logout: async ({ cookies }) => {
        cookies.delete('sessionid', { path: '/' });
        cookies.delete('userid', { path: '/' });

        redirect(303, '/login'); 
    }
};

