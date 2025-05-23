import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { getEmptyFields, objectifyFormData } from "$lib";
import { findUserEmail, insertUser } from "$lib/server/db/colUsers";
import { createAuthCookies, getHashedPassword } from "$lib/server/authentication";

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
     * This function handles /register POST requests where it adds
     * the new user's data to the DB, and authenticate them by adding
     * cookies.
     */
    default: async ({ cookies, request }) => {
        // Get form data
        const form = await request.formData();
        const { email, username, password, passwordConfirm } = objectifyFormData(form) as {
            [key: string]: string;
        };

        // Check for a duplicate email address.
        const possibleDuplicate = await findUserEmail(email)
            .then((doc) => {
                if (doc) return true;
                else return false;
            })
            .catch((error) => {
                console.log(error);
                return undefined;
            });

        // Check fields that haven't been filled out.
        if (!email || !username || !password || !passwordConfirm)
            return fail(400, { email, username, missing: getEmptyFields(form) });

        // Check if password and passwordConfirm field isn't filled out.
        if (password !== passwordConfirm)
            return fail(400, { email, username, nonMatchingPasswords: true });

        // Don't create an account if there's an issue with MongoDB.
        if (possibleDuplicate == undefined)
            return fail(400, { email, username, serverIssue: true });
        // Don't create an account if there is a duplicate.
        else if (possibleDuplicate) return fail(400, { email, username, possibleDuplicate });

        const hashPassword = getHashedPassword(password);

        return await insertUser(email, hashPassword, username)
            .then((user) => {
                console.log("Added user to database. Setting up cookies.");
                createAuthCookies(cookies, user.insertedId.toString());
                throw redirect(303, "/app/account");
            })
            .catch((error) => {
                console.log(error);
                return fail(500, { email, username, serverIssue: true });
            });
    },
};
