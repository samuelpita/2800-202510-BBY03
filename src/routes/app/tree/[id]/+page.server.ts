import type { PageServerLoad } from './$types';
import { ObjectId } from 'mongodb';
import { getTreesCollection } from '$lib/server/db';
import type { TreeDocument } from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;

	try {
		const treesCollection = await getTreesCollection();

		// ✅ Assert the returned document type
		const tree = await treesCollection.findOne<TreeDocument>({ _id: new ObjectId(id) });

		if (!tree) {
			return {
				status: 404,
				error: new Error('Tree not found')
			};
		}

		// ✅ Convert _id and return full tree with stringified _id
		const result: Omit<TreeDocument, '_id'> & { _id: string } = {
			...tree,
			_id: tree._id.toString()
		};

		return { tree: result };
	} catch (err) {
		console.error('Error fetching tree by id:', err);
		return {
			status: 500,
			error: new Error('Server error while loading tree')
		};
	}
};
