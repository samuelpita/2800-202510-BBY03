import { ObjectId } from "mongodb";
import type { Point } from "geojson";

interface AchievementDocument {
    type: string;
    goalValue: number;
    currentValue: number;
    dateCompleted: Date | null;
}

//#region Document Types

export type AdoptionDocument = {
    userId: ObjectId;
    treeId: ObjectId;
    active: boolean;
    dateAdopted: Date;
};

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

export type UserDocument = {
    email: string;
    password: string;
    username: string;
    dateJoined: Date;
};

//#endregion
