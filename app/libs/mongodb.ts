import { MongoClient } from 'mongodb';
const client = new MongoClient(process.env.MONGODB_URI || '');

export const connectToDatabase = async () => {
  try {
    await client.connect();
    return client.db();
  } catch (err) {
    console.log('Failed to Connect MongoDB', err);
  }
};
