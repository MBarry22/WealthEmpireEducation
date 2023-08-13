// db.js
import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://masonrwporter:@WealthEmpireLLC@wealthempire.cgnecod.mongodb.net/myapp?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = client.db();

export default db;

client.connect(err => {
  if (err) {
    console.error('MongoDB connection error:', err);
  } else {
    console.log('Connected to MongoDB');
  }
});
