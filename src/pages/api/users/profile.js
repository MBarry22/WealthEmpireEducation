import axios from 'axios';

export default async function handler(req, res) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const response = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: authorization,
      },
    });

    const user = response.data;
    return res.status(200).json(user);
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return res.status(500).json({ error: 'Failed to fetch user data' });
  }
}
