import { json } from '@sveltejs/kit';
import { adoptTree } from '$lib/server/db/colAdoptions';
import type { RequestEvent } from '@sveltejs/kit';

export const POST = async ({ request, cookies }: RequestEvent) => {
  const userId = cookies.get('userid');
  
  if (!userId) {
    return json({ success: false, message: 'You must be logged in to adopt a tree' }, { status: 401 });
  }

  try {
    const { treeId } = await request.json();
    
    if (!treeId) {
      return json({ success: false, message: 'Tree ID is required' }, { status: 400 });
    }
    
    const result = await adoptTree(userId, treeId);
    
    return json(result);
    
  } catch (error) {
    console.error('Error adopting tree:', error);
    return json({ 
      success: false, 
      message: 'Failed to adopt tree. Please try again later.'
    }, { status: 500 });
  }
}; 