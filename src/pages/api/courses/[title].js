import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const title = req.query.title;

    try {
      // Connect to MongoDB
      const client = await MongoClient.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const db = client.db();

      // Fetch the course from the "courses" collection using the title
      const course = await db.collection('courses').findOne({ title });

      // Close the database connection
      client.close();

      if (course) {
        // Return the course as a JSON response
        res.status(200).json(course);
      } else {
        // Return an error response if the course is not found
        res.status(404).json({ message: 'Course not found' });
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Unsupported method' });
  }
}
