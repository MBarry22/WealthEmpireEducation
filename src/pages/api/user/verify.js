import { verify } from 'jsonwebtoken';
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { token } = req.headers;

      if (!token) {
        res.status(401).json({ message: 'Missing token' });
        return;
      }

      const decodedToken = verify(token, process.env.JWT_SECRET);

      if (!decodedToken) {
        res.status(401).json({ message: 'Invalid token' });
        return;
      }

      const client = await MongoClient.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const db = client.db();

      const user = await db.collection('users').findOne({ username: decodedToken.username });

      if (!user) {
        res.status(401).json({ message: 'User not found' });
      } else {
        // Retrieve user-specific course information
        const courses = await db.collection('courses').find({ userId: user._id }).toArray();

        res.status(200).json({ username: user.username, courses });
      }

      client.close();
    } catch (error) {
      console.log('Token verification error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Unsupported method' });
  }
}
