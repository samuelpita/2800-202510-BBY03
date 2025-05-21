import {
	getTreesCollection,
	getTreeSpeciesCollection,
	findTreesNearPoint,
	searchTreeSpeciesIdArray
} from '$lib/server/db/colTrees';
import { ObjectId } from 'mongodb';
import type { PageServerLoad } from './$types';

const GEOAPIFY_API_KEY = 'ab5c55b4c56c41368efedfbd56a0000d';

async function reverseGeocode(lat: number, lon: number): Promise<string> {
	const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_API_KEY}`;
	try {
		const res = await fetch(url);
		if (!res.ok) return 'Unknown location';
		const data = await res.json();
		return data.features?.[0]?.properties?.formatted ?? 'Unknown location';
	} catch (err) {
		console.error('Geocoding error:', err);
		return 'Unknown location';
	}
}

function serializeTree(
	tree: any,
	speciesMap: Record<string, string>,
	location: string
): Record<string, any> {
	return {
		...tree,
		_id: tree._id.toString(),
		treeSpeciesId: tree.treeSpeciesId?.toString(),
		speciesName: speciesMap[tree.treeSpeciesId?.toString()] ?? "Unknown",
		location,
		speciesInfo: {
			...tree.speciesInfo,
			_id: tree.speciesInfo?._id?.toString(), // convert nested _id
		},
	};
}


export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get("q")?.trim().toLowerCase() ?? "";
	const lat = parseFloat(url.searchParams.get("lat") ?? "");
	const long = parseFloat(url.searchParams.get("long") ?? "");
	const radiusKm = parseFloat(url.searchParams.get("radius") ?? "");
	const speciesId = url.searchParams.get("speciesId") ?? "";

	const treesCol = await getTreesCollection();
	const speciesCol = await getTreeSpeciesCollection();

	const speciesRawList = await speciesCol.find({}).toArray();
	const speciesList = speciesRawList.map((s) => ({
		_id: s._id.toString(),
		commonName: s.commonName
	}));

	const speciesMap: Record<string, string> = {};
	speciesList.forEach((s) => {
		speciesMap[s._id] = s.commonName;
	});

	let trees: any[] = [];

	const hasCoords = !isNaN(lat) && !isNaN(long);
	const hasRadius = !isNaN(radiusKm) && radiusKm > 0;
	const isGeosearch = hasCoords && hasRadius;
	const isTextSearch = !!query || !!speciesId;

	// Skip if no criteria
	if (!isGeosearch && !isTextSearch) {
		return { trees: [], query, speciesId, speciesList, searched: false };
	}

	if (isGeosearch) {
		const found = await findTreesNearPoint([long, lat], {
			maxDistance: radiusKm * 1000,
			speciesSearch: query || undefined,
			limit: 100
		});

		trees = await Promise.all(
			found.map(async (tree) => {
				const coords = tree.location?.coordinates;
				const location = coords
					? await reverseGeocode(coords[1], coords[0])
					: "Unknown location";
				return serializeTree(tree, speciesMap, location);
			})
		);

		return {
			trees,
			query,
			radius: radiusKm,
			speciesId,
			speciesList,
			searched: true
		};
	}

	if (isTextSearch) {
		let speciesIds: ObjectId[] = [];

		if (speciesId) {
			speciesIds = [new ObjectId(speciesId)];
		} else {
			speciesIds = await searchTreeSpeciesIdArray(query);
		}

		const found = await treesCol
			.find({ treeSpeciesId: { $in: speciesIds } })
			.limit(100)
			.toArray();

		trees = await Promise.all(
			found.map(async (tree) => {
				const coords = tree.location?.coordinates;
				const location = coords
					? await reverseGeocode(coords[1], coords[0])
					: "Unknown location";
				return serializeTree(tree, speciesMap, location);
			})
		);

		return {
			trees,
			query,
			radius: radiusKm,
			speciesId,
			speciesList,
			searched: true
		};
	}

	return { trees: [], query, speciesId, speciesList, searched: true };
};
