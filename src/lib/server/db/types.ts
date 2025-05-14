import { ObjectId } from "mongodb";
import type { Point } from "geojson";

interface AchievementDocument {
    type: string;
    goalValue: number;
    currentValue: number;
    dateCompleted: Date | null;
}

//#region Actions & Reminders

export type ActionDetails = {
    title?: string;
    body?: string;
    tags?: string[];
};

export type ActionDocument = {
    adoptionId: ObjectId;
    type: string;
    details?: ActionDetails;
    dateCompleted: Date | null;
    dateCreated: Date;
};

export type ReminderDocument = {
    actionId: ObjectId;
    remindAtDate: Date;
};

//#endregion

//#region Adoptions

export type AdoptionDocument = {
    userId: ObjectId;
    treeId: ObjectId;
    active: boolean;
    dateAdopted: Date;
};

export type AdoptionAchievementDocument = AchievementDocument & {
    adoptionId: ObjectId;
};

//#endregion

//#region Trees

export type TreeAge = "seed" | "seedling" | "sapling" | "mature";

export type TreeDocument = {
    speciesId: ObjectId;
    location: string;
    coordinates: {
        lat: number;
        long: number;
    };
    datePlanted: Date;
    dateCreated: Date;
    imgUrl?: string;
    stats?: TreeStats;
};

export type TreeSpeciesDocument = {
    commonName: string;
    scientificName: string;
};

export type TreeStats = {
    dateUpdated: Date;
    age?: TreeAge;
    diameter?: number;
    height?: number;
};

//#endregion

//#region Users

export type UserDocument = {
    email: string;
    password: string;
    username: string;
    dateJoined: Date;
};

export type UserAchievementDocument = AchievementDocument & {
    userId: ObjectId;
};

//#endregion
