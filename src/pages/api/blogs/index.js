import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const postId = req.query.id; // Extract the blog post ID from the request URL

    if (postId) {
      // Connect to MongoDB
      const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      const db = client.db();

      // Fetch the specific blog post from the "blogs" collection using the ID
      const blog = await db.collection('blogs').findOne({ _id: ObjectId(postId) });

      // Close the database connection
      client.close();

      if (blog) {
        // Return the individual blog post as a JSON response
        res.status(200).json(blog);
      } else {
        // Return an error response if the blog post is not found
        res.status(404).json({ message: 'Blog post not found' });
      }
    } else {
      // Connect to MongoDB
      const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      const db = client.db();

      // Find all documents in the "blogs" collection and return them as an array
      const blogs = await db.collection('blogs').find().toArray();

      // Close the database connection
      client.close();

      // Return the blogs as a JSON response
      res.status(200).json(blogs);
    }
  } else {
    // Return an error response for unsupported HTTP methods
    res.status(405).json({ message: 'Unsupported method' });
  }
}
