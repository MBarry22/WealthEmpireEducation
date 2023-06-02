import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Connect to MongoDB
async function connectToDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client.db();
}

// Sign in a user
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  try {
    // Connect to MongoDB
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Find the user by username
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '4000d' });

    // Return the token and user information as response
    res.status(200).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}