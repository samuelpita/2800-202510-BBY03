import { error } from '@sveltejs/kit';
import { createDownloadStream, getFileById } from '$lib/server/db/gridfs';
import type { RequestHandler } from './$types';
import { Readable } from 'stream';

export const GET: RequestHandler = async ({ params }) => {
    const fileId = params.id;
    
    if (!fileId) {
        throw error(400, 'File ID is required');
    }
    
    try {
        const fileInfo = await getFileById(fileId);
        
        if (!fileInfo) {
            throw error(404, 'File not found');
        }
        
        const downloadStream = await createDownloadStream(fileId);
        
        const chunks: Buffer[] = [];
        for await (const chunk of downloadStream) {
            chunks.push(Buffer.from(chunk));
        }
        const buffer = Buffer.concat(chunks);
        
        const response = new Response(buffer);
        
        if (fileInfo.metadata?.contentType) {
            response.headers.set('Content-Type', fileInfo.metadata.contentType);
        } else {
            response.headers.set('Content-Type', 'image/jpeg');
        }
        
        response.headers.set('Cache-Control', 'public, max-age=31536000');
        
        return response;
    } catch (err) {
        console.error('Error serving image:', err);
        throw error(500, 'Failed to retrieve image');
    }
}; 