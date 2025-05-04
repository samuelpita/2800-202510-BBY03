// place files you want to import through the `$lib` alias in this folder.

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
