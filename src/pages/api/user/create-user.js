import { MongoClient } from 'mongodb';
import { hash } from 'bcrypt';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const options = {
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Connect to MongoDB
          const client = await MongoClient.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          const db = client.db();

          // Hash the password
          const hashedPassword = await hash(credentials.password, 10);

          // Insert the user data into the "users" collection
          const result = await db.collection('users').insertOne({
            username: credentials.username,
            password: hashedPassword,
            role: 'Customer',
          });

          // Close the database connection
          client.close();

          // Return the inserted user object
          return Promise.resolve({ id: result.insertedId, username: credentials.username, role: 'Customer' });
        } catch (error) {
          // Handle any errors
          return Promise.reject(new Error('Internal server error'));
        }
      },
    }),
  ],
  pages: {
    signIn: '/signin',
  },
};

export default (req, res) => NextAuth(req, res, options);
