import { ObjectId } from "mongodb";
import type { Point } from "geojson";

interface AchievementDocument {
    type: string;
    goalValue: number;
    currentValue: number;
    dateCompleted: Date | null;
}

interface GuideFormat {
    title: string;
    content: string;
    dateCreated: Date;
    dateUpdated?: Date;
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

//#region Guides

export type GuideDocument = GuideFormat & {
    userId?: ObjectId;
};

export type TreeSpeciesGuideDocument = GuideFormat & {
    treeSpeciesId: ObjectId;
    userId?: ObjectId;
};

//#endregion

//#region Trees

export type TreeStage = "seed" | "seedling" | "sapling" | "mature" | "snag";

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

export type TreeLogsDocument = {
    treeId: ObjectId;
    stage?: TreeStage;
    diameter?: number;
    height?: number;
    health?: string;
    dateCreated: Date;
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