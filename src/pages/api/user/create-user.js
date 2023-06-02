import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const MONGODB_URI = 'mongodb+srv://masonrwporter:SOdARF3FyDVkmSrA@wealthempire.2rah3ym.mongodb.net/';
const JWT_SECRET = 'LAI@HSD!jsadLSdsadgusaIud3JHS';

// Connect to MongoDB
async function connectToDatabase() {
  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client.db();
}

// Sign up a new user
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  try {
    // Connect to MongoDB
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = {
      username,
      password: hashedPassword,
    };

    // Insert the new user into the database
    const result = await usersCollection.insertOne(newUser);

    // Generate JWT token
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' });

    // Return the token as response
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}