import { MongoClient } from 'mongodb';

// Connect to MongoDB
async function connectToDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client.db();
}

// Get the list of roles
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Connect to MongoDB
    const db = await connectToDatabase();
    const rolesCollection = db.collection('roles');

    // Fetch the list of roles
    const roles = await rolesCollection.find().toArray();

    // Return the roles as response
    res.status(200).json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
