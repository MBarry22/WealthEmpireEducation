import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

async function connectToDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client.db();
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');

  try {
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const db = await connectToDatabase();

    const user = await db.collection('users').findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isAdmin = user.roles.includes('647fd88a379b76dafa49e7cb');

    if (isAdmin) {
      return res.status(200).json({ message: 'Access granted' });
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
