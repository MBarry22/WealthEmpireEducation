import { signOut } from 'next-auth/client';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Call the signOut function from next-auth/client to sign the user out
      await signOut({ redirect: false });

      // Clear the token from client-side by sending it as a response header
      res.setHeader('Set-Cookie', 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');

      // Return a success response
      res.status(200).json({ message: 'User signed out successfully' });
    } catch (error) {
      console.log('Sign-out error:', error);
      // Handle sign-out errors, such as logging the error or returning an error response
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // Return an error response for unsupported HTTP methods
    res.status(405).json({ message: 'Unsupported method' });
  }
}
