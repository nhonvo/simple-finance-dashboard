import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI ?? '';
const DATABASE_NAME = process.env.DATABASE_NAME ?? '';

if (MONGODB_URI === '') {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function connectToDatabase(): Promise<mongoose.Connection> {
    try {
        // Directly connect to the database
        const mongooseInstance = await mongoose.connect(MONGODB_URI, {
            dbName: DATABASE_NAME,
            bufferCommands: false,
        });
        return mongooseInstance.connection;
    } catch {
        throw new Error('Failed to connect to MongoDB');
    }
}

export { connectToDatabase };
