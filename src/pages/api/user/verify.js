import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    try{
      // Retrive the token from the request headers
      const token = req.headers.authorization?.replace('Bearer ', '');

      if(!token){
        return res.status(401).json({ error: 'Missing auth token' });
      }

      // Verify the token using the JWT_SECRET from .env.local
      jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if(error){
          return res.status(401).json({ error: 'Invalid auth token' });
        }

        // Return the decoded token
        res.status(200).json({ userId: decoded.userId });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });

    }
  }