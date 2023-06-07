import { MongoClient } from 'mongodb';

// Connect to MongoDB
async function connectToDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client.db();
}

// Create a new role
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, permissions } = req.body;

  try {
    // Connect to MongoDB
    const db = await connectToDatabase();
    const rolesCollection = db.collection('roles');

    // Check if role with the same name already exists
    const existingRole = await rolesCollection.findOne({ name });
    if (existingRole) {
      return res.status(409).json({ error: 'Role already exists' });
    }

    // Create a new role
    const newRole = {
      name
    };

    // Insert the new role into the database
    const result = await rolesCollection.insertOne(newRole);

    // Return success response
    res.status(201).json({ message: 'Role created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
