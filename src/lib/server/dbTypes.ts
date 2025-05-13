import { ObjectId } from "mongodb";
import type { Point } from "geojson";

/*
    Add your DB types here!
*/

export type ActionDocument = {
    _id: ObjectId;
    adoptionId: ObjectId;
    type: string;
    data: {
        title?: string;
        body?: string;
        tags?: string[];
        [key: string]: any;
    };
    dateCompleted: Date | null;
    dateCreated: Date;
};

export type AdoptionDocument = {
    _id: ObjectId;
    userId: ObjectId;
    treeId: ObjectId;
    active: boolean;
    dateAdopted: Date;
};

export type AdoptionAchievementDocument = {
    _id: ObjectId;
    adoptionId: ObjectId;
    type: string;
    goalValue: number;
    currentValue: number;
    dateCompleted: Date | null;
};

export type ReminderDocument = {
    _id: ObjectId;
    actionId: ObjectId;
    remindAtDate: Date;
    notifyBefore: number;
};

export type TreeDocument = {
    _id: ObjectId;
    treeSpeciesId: ObjectId;
    location: Point;
    datePlanted: Date;
    dateCreated: Date;
};

export type TreeSpeciesDocument = {
    _id: ObjectId;
    commonName: string;
    scientificName: string;
};

export type TreeStatsDocument = {
    _id: ObjectId;
    treeId: ObjectId;
    age: number;
    height: number;
    health: string;
    stage: string;
    dateUpdated: Date;
};

export type UserDocument = {
    _id: ObjectId;
    email: string;
    password: string;
    username: string;
};

export type UserAchievementDocument = {
    _id: ObjectId;
    userId: ObjectId;
    type: string;
    goalValue: number;
    currentValue: number;
    dateCompleted: Date | null;
};
