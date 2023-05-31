import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { authorization } = req.headers;

      if (!authorization || !authorization.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Missing or invalid token' });
        return;
      }

      const token = authorization.split(' ')[1];

      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          res.status(401).json({ message: 'Invalid token' });
        } else {
          const { userId } = decodedToken;
          res.status(200).json({ userId });
        }
      });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Unsupported method' });
  }
}
