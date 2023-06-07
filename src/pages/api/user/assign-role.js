import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';

// Connect to MongoDB
async function connectToDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client.db();
}

// Assign a role to a user
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userId, roleId } = req.body;

  try {
    // Connect to MongoDB
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Find the user by their ID
    const user = await usersCollection.findOne({ _id: { $eq: ObjectId.createFromHexString(userId) } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's roles
    const updatedUser = await usersCollection.findOneAndUpdate(
      { _id: { $eq: ObjectId.createFromHexString(userId) } },
      { $addToSet: { roles: ObjectId.createFromHexString(roleId) } },
      { returnDocument: 'after' }
    );

    // Return the updated user as response
    res.status(200).json(updatedUser.value);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
