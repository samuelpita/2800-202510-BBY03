import { compile } from "mdsvex";
import { type WithId, type Document, ObjectId } from "mongodb";

// Helper types //

export type DistReplaceType<TProp, TOld, TNew> = TProp extends TOld ? TNew : TProp;

export type ReplaceType<T, OldType, NewType> = {
    [P in keyof T]: DistReplaceType<T[P], OldType, NewType>;
};

// ObjectId helper functions //

export function stringifyObjectIds<TDocument extends Document>(doc: WithId<TDocument>) {
    for (const key of Object.keys(doc)) {
        if (doc[key] instanceof ObjectId) {
            doc[key] = doc[key].toString();
        }
    }

    return doc as ReplaceType<WithId<TDocument>, ObjectId, string>;
}

// String helper functions //

export function stringStartsWithAny(source: string, ...keys: string[]) {
    for (const key of keys) {
        if (source.startsWith(key)) return key;
    }
    return false;
}

// FormData helper functions //

export function objectifyFormData(form: FormData, includeOnly?: string[]) {
    const objectForm: { [key: string]: FormDataEntryValue } = {};

    form.forEach((value, key) => {
        if (includeOnly) {
            if (includeOnly.includes(key)) objectForm[key] = value;
        } else {
            objectForm[key] = value;
        }
    });

    return objectForm;
}

export function getEmptyFields(form: FormData, includeOnly?: string[]) {
    const missing: string[] = [];

    form.forEach((value, key) => {
        if (includeOnly) {
            if (includeOnly.includes(key) && !value) missing.push(key);
        } else {
            if (!value) missing.push(key);
        }
    });

    return missing;
}

// Window helper functions //

export function isDarkMode() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// Markdown helper functions //

export async function compileMarkdown(source: string) {
    const result = await compile(source);

    if (result) return result;
    throw new Error("(compileMarkdown) Source did not compile.");
}
