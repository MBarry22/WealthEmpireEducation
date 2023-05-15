import { verify } from 'jsonwebtoken';
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
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

      const { userId, course } = req.body;

      const client = await MongoClient.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const db = client.db();

      // Update the user's course in the database
      await db.collection('users').updateOne(
        { userId: userId },
        { $set: { course: course } },
        { upsert: true }
      );

      client.close();

      res.status(200).json({ message: 'Answers submitted successfully' });
    } catch (error) {
      console.error('Error submitting answers:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Unsupported method' });
  }
}
