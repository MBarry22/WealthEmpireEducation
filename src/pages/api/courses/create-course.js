import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Get the data from the request body
    const { title, description, adminId } = req.body;

    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db();

    // Create a new course document
    const newCourse = {
      title,
      description,
      admin: ObjectId(adminId), // Convert adminId to ObjectId
      enrolledUsers: [],
    };

    // Insert the new course document into the "courses" collection
    const result = await db.collection('courses').insertOne(newCourse);

    // Close the database connection
    client.close();

    // Return a JSON response with the ID of the new course
    res.status(201).json({ id: result.insertedId });
  } else if (req.method === 'GET') {
    // Extract the course ID from the request URL
    const courseId = req.query.id;

    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db();

    // Fetch the course from the "courses" collection using the ID
    const course = await db.collection('courses').findOne({ _id: ObjectId(courseId) });

    // Close the database connection
    client.close();

    if (course) {
      // Render the course as a separate page
      res.status(200).json(course);
    } else {
      // Return an error response if the course is not found
      res.status(404).json({ message: 'Course not found' });
    }
  } else {
    // Return an error response for unsupported HTTP methods
    res.status(405).json({ message: 'Unsupported method' });
  }
}
