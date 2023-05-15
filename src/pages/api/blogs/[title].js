import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { title } = req.query; // Extract the blog post title from the request URL

    if (title) {
      try {
        // Connect to MongoDB
        const client = await MongoClient.connect(process.env.MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        const db = client.db();

        // Fetch the specific blog post from the "blogs" collection using the title
        const blog = await db.collection('blogs').findOne({ title });

        // Close the database connection
        client.close();

        if (blog) {
          // Return the individual blog post as a JSON response
          res.status(200).json(blog);
        } else {
          // Return an error response if the blog post is not found
          res.status(404).json({ message: 'Blog post not found' });
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      // Return a bad request error if the title is missing
      res.status(400).json({ message: 'Missing blog post title' });
    }
  } else {
    // Return an error response for unsupported HTTP methods
    res.status(405).json({ message: 'Unsupported method' });
  }
}
