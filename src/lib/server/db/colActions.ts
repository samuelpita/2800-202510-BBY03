import { ensureId } from "./helper";
import { startConnection } from "./mongo";
import { MONGODB_DATABASE } from "$env/static/private";
import type { ReminderDocument, ActionDocument, ActionDetails } from "./types";
import type { ObjectId } from "mongodb";

//#region Collection Functions

export function getActionsCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection<ActionDocument>("actions");
    });
}

export function getRemindersCollection() {
    return startConnection().then((client) => {
        return client.db(MONGODB_DATABASE).collection<ReminderDocument>("reminders");
    });
}

//#endregion

//#region Action CRUD

export function insertAction(adoptionId: ObjectId | string, type: string, details?: ActionDetails) {
    return getActionsCollection().then((actions) => {
        return actions.insertOne({
            adoptionId: ensureId(adoptionId),
            type,
            details,
            dateCompleted: null,
            dateCreated: new Date(),
        });
    });
}

export function markActionCompleted(id: ObjectId | string) {
    return getActionsCollection().then((actions) => {
        return actions.updateOne({ _id: ensureId(id) }, { $set: { dateCompleted: new Date() } });
    });
}

export function updateActionDetails(id: ObjectId | string, details?: ActionDetails) {
    return getActionsCollection().then((actions) => {
        return actions.updateOne({ _id: ensureId(id) }, { details });
    });
}

export function deleteAction(id: ObjectId | string) {
    return getActionsCollection().then((actions) => {
        return actions.deleteOne({ _id: ensureId(id) });
    });
}

//#endregion

//#region Reminder CRUD

export function insertReminder(actionId: ObjectId | string, remindAtDate: Date) {
    return getRemindersCollection().then((reminders) => {
        return reminders.insertOne({ actionId: ensureId(actionId), remindAtDate });
    });
}

export function findReminders(actionId: ObjectId | string) {
    return getRemindersCollection().then((reminders) => {
        return reminders.find({ actionId: ensureId(actionId) });
    });
}

//#endregion
