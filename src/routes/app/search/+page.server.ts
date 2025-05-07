import type { PageServerLoad } from './$types';
import { getTreesCollection } from '$lib/server/db';
import type { TreeDocument } from '$lib/server/db';

export const load: PageServerLoad = async ({ url }) => {
	const species = url.searchParams.get('species')?.trim();
	const location = url.searchParams.get('location')?.trim();

	const query: any = {};
	if (species) query.species = { $regex: new RegExp(species, 'i') };
	if (location) query.location = { $regex: new RegExp(location, 'i') };

	let trees: TreeDocument[] = [];

	try {
		const treesCollection = await getTreesCollection();
		trees = (await treesCollection.find(query).toArray()) as TreeDocument[];
	} catch (err) {
		console.error('Error fetching trees:', err);
	}

	return {
		trees: trees.map((tree) => ({
			_id: tree._id.toString(),
			name: tree.name,
			species: tree.species,
			location: tree.location,
			imageUrl: tree.imageUrl || null
		})),
		searched: Boolean(species || location)
	};
};
