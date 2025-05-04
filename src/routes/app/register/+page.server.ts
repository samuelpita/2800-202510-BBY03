import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { getEmptyFields, objectifyFormData } from "$lib";
import { insertUser } from "$lib/server/db";
import { createAuthCookies, getHashedPassword } from "$lib/server/authentication";
import { endConnection } from "$lib/server/mongo";

export const load: PageServerLoad = async ({ cookies }) => {
    const sessionId = cookies.get("sessionid");
    const userId = cookies.get("userid");

    // Redirect the user if they're already logged in.
    if (sessionId && userId) throw redirect(303, "/app/account");
};

export const actions: Actions = {
    /**
     * Register Action (Default)
     *
     * This function handles /app/register POST requests where it adds
     * the new user's data to the DB, and authenticate them by adding
     * cookies.
     */
    default: async ({ cookies, request }) => {
        // Get form data
        const form = await request.formData();
        const { email, username, password, passwordConfirm } = objectifyFormData(form) as {
            [key: string]: string;
        };

        // Check fields that haven't been filled out.
        if (!email || !username || !password)
            return fail(400, { email, username, missing: getEmptyFields(form) });
        // Check if Password and Confirm Password field isn't filled out.
        else if (password !== passwordConfirm)
            return fail(400, { email, username, nonMatchingPasswords: true });

        const hashPassword = getHashedPassword(password);

        return await insertUser({ email, username, password: hashPassword })
            .then((user) => {
                console.log("Added user to database. Setting up cookies.");
                createAuthCookies(cookies, user.insertedId.toString());
                throw redirect(303, "/app/account");
            })
            .finally(endConnection);
    },
};
