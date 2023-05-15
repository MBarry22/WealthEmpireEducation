import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import { hash } from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Get the data from the request body
      const data = req.body;

      // Set the role to "Customer"
      data.role = 'Customer';

      // Connect to MongoDB
      const client = await MongoClient.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const db = client.db();

      // Hash the password
      const hashedPassword = await hash(data.password, 10);

      // Generate a JWT token as the user ID
      const token = jwt.sign({ username: data.username, role: data.role }, process.env.JWT_SECRET);

      // Insert the user data into the "users" collection with the JWT token as the ID and hashed password
      const result = await db.collection('users').insertOne({ ...data, _id: token, password: hashedPassword });

      // Close the database connection
      client.close();

      // Return a JSON response with the JWT token as the ID
      res.status(201).json({ token });
    } catch (error) {
      // Handle any errors
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // Return an error response for unsupported HTTP methods
    res.status(405).json({ message: 'Unsupported method' });
  }
}
