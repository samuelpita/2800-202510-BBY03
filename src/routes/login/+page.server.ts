import { createAuthCookies, passwordMatchesHash } from "$lib/server/authentication";
import { findUserByEmail } from "$lib/server/db";
import { endConnection } from "$lib/server/mongo";
import { getEmptyFields, objectifyFormData } from "$lib";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
    const sessionId = cookies.get("sessionid");
    const userId = cookies.get("userid");

    // Redirect the user if they're already logged in.
    if (sessionId && userId) throw redirect(303, "/app/account");
};

export const actions: Actions = {
    /**
     * Login Action (Default)
     *
     * Like how you'd have an Express app.post() function that executes when
     * the user is on a certain URL, this function runs when the URL is
     * /login?/login, and helps you authenticate to the app, with
     * the relevant form parameters given in the HTTP request.
     */
    default: async ({ cookies, request }) => {
        const form = await request.formData();
        const { email, password } = objectifyFormData(form) as { [key: string]: string };

        // Checks if any of the fields are empty.
        if (!email || !password) return fail(400, { email, missing: getEmptyFields(form) });

        // Begin handling authentication
        return await findUserByEmail(email)
            .then((user) => {
                // Returns an error if the user doesn't exist.
                if (!user) return fail(400, { email, incorrect: true });

                // Returns an error if the passwords don't match.
                if (!passwordMatchesHash(password, user.password))
                    return fail(400, { email, incorrect: true });

                // Setup the session cookies.
                createAuthCookies(cookies, user._id.toString());

                // Done! Redirect the user to the account page.
                throw redirect(303, "/app/account");
            })
            .finally(endConnection);
    },
};
