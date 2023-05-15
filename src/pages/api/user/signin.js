import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { MongoClient } from 'mongodb';


export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const { username, password } = req.body;
  
        // Connect to MongoDB
        const client = await MongoClient.connect(process.env.MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        const db = client.db();
  
        // Retrieve the user from the database based on the username
        const user = await db.collection('users').findOne({ username });
  
        if (!user) {
          // User not found
          res.status(401).json({ message: 'Invalid credentials' });
        } else {
          // Compare the provided password with the stored password hash
          const passwordMatch = await compare(password, user.password);
  
          if (!passwordMatch) {
            // Incorrect password
            res.status(401).json({ message: 'Invalid credentials' });
          } else {
            // Generate the JWT token
            const token = sign({ username: user.username, role: user.role }, process.env.JWT_SECRET);
  
            // Return the JWT token as the response
            res.status(200).json({ token });
          }
        }
  
        // Close the database connection
        client.close();
      } catch (error) {
        console.log('Sign-in error:', error);
        // Handle any errors
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      // Return an error response for unsupported HTTP methods
      res.status(405).json({ message: 'Unsupported method' });
    }
  }
  