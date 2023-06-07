import { MongoClient } from 'mongodb';

// Connect to MongoDB
async function connectToDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client.db();
}

// Get the list of users
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Connect to MongoDB
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Fetch the list of users
    const users = await usersCollection.find().toArray();

    // Return the users as response
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
