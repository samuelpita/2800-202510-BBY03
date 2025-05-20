import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }
     const treeId = url.searchParams.get('treeId');
    
    if (!treeId) {
        throw redirect(302, '/app');
    }

    return {
        treeId
    };
}; 