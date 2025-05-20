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

export type TreeDocument = {
    treeSpeciesId: ObjectId;
    location: Point;
    datePlanted: Date;
    dateCreated: Date;
};

export type TreeSpeciesDocument = {
    commonName: string;
    scientificName: string;
};

export type AdoptedTree = {
    adoption: {
        _id: string;
        userId: string;
        treeId: string;
        active: boolean;
        dateAdopted: string | Date;
    };
    tree: {
        _id: string;
        treeSpeciesId: string;
        location?: Point;
        datePlanted?: Date;
        dateCreated?: Date;
        speciesInfo?: {
            commonName: string;
            scientificName: string;
        };
    };
};

export type Tree = {
    _id?: string;
    speciesInfo?: {
      commonName: string;
      scientificName: string;
    };
    location?: {
      coordinates: [number, number];
    };
    datePlanted?: string | Date;
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
