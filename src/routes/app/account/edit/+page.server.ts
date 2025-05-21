import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { findUserId, updateUser } from '$lib/server/db/colUsers';
import { uploadFile } from '$lib/server/db/gridfs';

export const load: PageServerLoad = async ({ locals, cookies }) => {
    const sessionId = cookies.get('sessionid');
    const userId = cookies.get('userid');

    if (!(sessionId && userId)) {
        throw redirect(303, '/login');
    }

    if (!locals.user) {
        throw redirect(303, '/login');
    }

    const user = await findUserId(userId);
    
    if (!user) {
        throw redirect(303, '/login');
    }

    return {
        user: {
            ...locals.user,
            profilePicture: user.profilePicture || ''
        }
    };
};

export const actions: Actions = {
    updateProfile: async ({ request, cookies, locals }) => {
        const userId = cookies.get('userid');
        
        if (!userId || !locals.user) {
            throw redirect(303, '/login');
        }
        
        const formData = await request.formData();
        const username = formData.get('username')?.toString();
        const profileImage = formData.get('profileImage') as File;
        
        if (!username?.trim()) {
            return fail(400, { 
                error: 'Username is required',
                values: { username }
            });
        }
        
        try {
            const updateData: { username: string; profilePicture?: string } = { 
                username 
            };
            
            // Handle profile image upload
            if (profileImage && profileImage.size > 0) {
                const fileExtension = profileImage.name.split('.').pop() || 'jpg';
                const fileName = `profile_${userId}_${Date.now()}.${fileExtension}`;
                
                // Convert file to buffer
                const buffer = Buffer.from(await profileImage.arrayBuffer());
                
                // Get MIME type from the file
                const contentType = profileImage.type || 'image/jpeg';
                
                // Upload to GridFS with metadata
                const fileId = await uploadFile(buffer, fileName, {
                    userId,
                    contentType,
                    uploadDate: new Date(),
                    type: 'profile'
                });
                
                // Store the file ID in the user's profile
                updateData.profilePicture = `/api/images/${fileId}`;
            }
            
            await updateUser(userId, updateData);
            
            return {
                success: true,
                message: 'Profile updated successfully'
            };
        } catch (error) {
            console.error('Error updating profile:', error);
            return fail(500, { 
                error: 'Failed to update profile',
                values: { username } 
            });
        }
    }
}; 