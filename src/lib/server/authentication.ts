import * as bcrypt from "bcrypt";
import { dev } from "$app/environment";
import { NUM_SALTS } from "$env/static/private";
import type { CookieSerializeOptions } from "cookie";
import type { Cookies } from "@sveltejs/kit";

// Password Hashing //

export function getHashedPassword(password: string) {
    return bcrypt.hashSync(password, parseInt(NUM_SALTS));
}

export function passwordMatchesHash(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
}

// Cookie Management //

export const cookieOptions: CookieSerializeOptions & { path: string } = {
    path: "/",
    httpOnly: !dev,
    secure: !dev,
    maxAge: 60 * 60 * 24,
};

export const cookieOptionsDelete: CookieSerializeOptions & { path: string } = {
    path: "/",
};

/**
 * Creates authentication cookies.
 *
 * How to get the document ID?
 *
 * 1. If you have the document as a ```WithId<Document>```, type: ```doc._id.toString()```.
 *    You'll likely encounter this more often, usually in reading/getting data
 *    from the DB.
 *
 * 2. If you have the document as a ```InsertOneResult<Document>```, type:
 *    ```doc.insertedId.toString()```. You'll encounter this in situations
 *    where you're adding data to the DB.
 */
export function createAuthCookies(cookies: Cookies, userId: string) {
    const sessionId = crypto.randomUUID();
    cookies.set("sessionid", sessionId, cookieOptions);
    cookies.set("userid", userId, cookieOptions);
}

/**
 * Deletes authentication cookies.
 */
export function deleteAuthCookies(cookies: Cookies) {
    cookies.delete("sessionid", cookieOptionsDelete);
    cookies.delete("userid", cookieOptionsDelete);
}
