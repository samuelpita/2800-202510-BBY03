import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import { startConnection } from './mongo';
import { MONGODB_DATABASE } from '$env/static/private';

// Create a GridFS bucket for file storage
export async function getGridFSBucket() {
    const client = await startConnection();
    const db = client.db(MONGODB_DATABASE);
    return new GridFSBucket(db, { bucketName: 'uploads' });
}

// Upload a file to GridFS
export async function uploadFile(fileBuffer: Buffer, filename: string, metadata: Record<string, any> = {}) {
    const bucket = await getGridFSBucket();
    
    // Create an upload stream
    const uploadStream = bucket.openUploadStream(filename, {
        metadata
    });
    
    // Write the buffer to the stream
    uploadStream.write(fileBuffer);
    uploadStream.end();
    
    // Return a promise that resolves with the file ID when the upload is complete
    return new Promise<string>((resolve, reject) => {
        uploadStream.on('finish', () => {
            resolve(uploadStream.id.toString());
        });
        
        uploadStream.on('error', (error) => {
            reject(error);
        });
    });
}

// Get a file from GridFS by ID
export async function getFileById(fileId: string) {
    const bucket = await getGridFSBucket();
    
    try {
        const files = await bucket.find({ _id: new ObjectId(fileId) }).toArray();
        
        if (files.length === 0) {
            return null;
        }
        
        return files[0];
    } catch (error) {
        console.error('Error getting file by ID:', error);
        return null;
    }
}

// Create a download stream for a file
export async function createDownloadStream(fileId: string) {
    const bucket = await getGridFSBucket();
    return bucket.openDownloadStream(new ObjectId(fileId));
}

// Delete a file from GridFS
export async function deleteFile(fileId: string) {
    const bucket = await getGridFSBucket();
    
    try {
        await bucket.delete(new ObjectId(fileId));
        return true;
    } catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
} 