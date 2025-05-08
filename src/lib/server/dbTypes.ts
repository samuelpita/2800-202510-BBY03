import { ObjectId } from "mongodb";
import type { Point } from "geojson";

/*
    Add your document types here!
*/

export type ActionDocument = {
    adoptionId: ObjectId;
    type: string;
    data: {
        title?: string;
        body?: string;
        tags?: string[];
        [key: string]: any;
    };
    completionDate: Date | null;
    creationDate: Date;
};

export type AdoptionDocument = {
    userId: ObjectId;
    treeId: ObjectId;
    active: boolean;
    adoptionDate: Date;
};

export type AdoptionAchievementDocument = {
    adoptionId: ObjectId;
    type: string;
    goalValue: number;
    currentValue: number;
    completionDate: Date | null;
};

export type ReminderDocument = {
    actionId: ObjectId;
    remindAtDate: Date;
    notifyBefore: number;
};

export type TreeDocument = {
    treeSpeciesId: ObjectId;
    name: string;
    location: Point;
    plantDate: Date;
    creationDate: Date;
};

export type TreeSpeciesDocument = {
    commonNames: string[];
    scientificName: string;
    stages: {
        seed: [number, number];
        seedling: [number, number];
        sapling: [number, number];
        mature: [number, number];
    } | null;
};

export type TreeStatsDocument = {
    treeId: ObjectId;
    age: number;
    height: number;
    health: string;
    stage: string;
    updated: Date;
};

export type UserDocument = {
    email: string;
    password: string;
    username: string;
};

export type UserAchievementDocument = {
    userId: ObjectId;
    type: string;
    goalValue: number;
    currentValue: number;
    completionDate: Date | null;
};
