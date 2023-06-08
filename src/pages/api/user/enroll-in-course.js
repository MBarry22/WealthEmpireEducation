import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    // Extract the course ID and user ID from the request body
    const { courseId, userId } = req.body;

    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db();

    // Check if the user is already enrolled in the course
    const course = await db.collection('courses').findOne({
      _id: new ObjectId(courseId),
      enrolledUsers: { $in: [userId] } // Convert userId to match the type in the document
    });
    if (course) {
      // User is already enrolled in the course
      client.close();
      return res.status(400).json({ error: 'User is already enrolled in the course' });
    }

    // Enroll the user in the course
    const result = await db.collection('courses').updateOne(
      { _id: new ObjectId(courseId) },
      { $addToSet: { enrolledUsers: userId } } // Convert userId to match the type in the document
    );

    // Close the database connection
    client.close();

    if (result.modifiedCount === 1) {
      // Enrollment successful
      res.status(200).json({ message: 'Enrollment successful' });
    } else {
      // Failed to enroll in the course
      res.status(400).json({ error: 'Failed to enroll in the course' });
    }
  } else {
    // Return an error response for unsupported HTTP methods
    res.status(405).json({ message: 'Unsupported method' });
  }
}
