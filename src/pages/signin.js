import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/user/signin', { username, password });

      const { token, user } = response.data;
      const { username: signedInUsername } = user;

      // Save the token and username to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', signedInUsername);

      // Redirect to the home page or the desired destination
      router.push('/');
    } catch (error) {
      console.log('Sign-in error:', error);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-black">
      <div className="container mx-auto p-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-5xl font-bold text-center logo-text">Sign In</h1>
          <p className="text-2xl font-bold text-center logo-text">Welcome back!</p>
        </div>

        <form onSubmit={handleSignIn} className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="username" className="block mb-1 text-lg font-medium text-gray-800">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 text-lg font-medium text-gray-800">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}