import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

// Connect to MongoDB
async function connectToDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client.db();
}

// Check if the user has the Admin role
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');

  try {
    // Verify and decode the JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get the user's ID from the decoded token
    const userId = decodedToken.userId;

    // Connect to the database
    const db = await connectToDatabase();

    // Find the user in the database
    const user = await db.collection('users').findOne({ _id: userId });

    // Check if the user has the Admin role
    const isAdmin = user.roles.includes('647fd88a379b76dafa49e7cb');

    if (isAdmin) {
      // User has the Admin role, allow access
      return res.status(200).json({ message: 'Access granted' });
    } else {
      // User does not have the Admin role, deny access
      return res.status(403).json({ error: 'Access denied' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
