import type { Position } from "geojson";

// GeoJSON helper functions //

export function positionToString(position: Position): string {
    let [long, lat] = position;
    return `#${long}_${lat}`;
}

export function parseStringPosition(stringPosition: string): Position {
    if (stringPosition.charAt(0) != "#")
        throw new Error("Given argument is not a string position query.");

    const [rawLong, rawLat] = stringPosition.slice(1).split("_");
    return [parseFloat(rawLong), parseFloat(rawLat)];
}
