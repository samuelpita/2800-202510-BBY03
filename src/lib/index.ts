// place files you want to import through the `$lib` alias in this folder.

// FormData helper functions //

export function objectifyFormData(form: FormData) {
    const objectForm: { [key: string]: FormDataEntryValue } = {};

    form.forEach((value, key) => {
        objectForm[key] = value;
    });

    return objectForm;
}

export function getEmptyFields(form: FormData) {
    const missing: string[] = [];

    form.forEach((value, key) => {
        if (!value) missing.push(key);
    });

    return missing;
}
