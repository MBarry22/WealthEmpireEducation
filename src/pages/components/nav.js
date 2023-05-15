import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import wealthEmpire from '../components/images/wealthEmpire.png';

export default function Nav() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Function to check if the user is signed in
    const checkUserSignIn = async () => {
      try {
        // Get the token from local storage or cookies
        // For example, if using local storage:
        const token = localStorage.getItem('token');

        if (token) {
          // Send a GET request to the API to verify the user's token
          const response = await axios.get('/api/user/verify', {
            headers: { token }, // Include the token in the headers
          });

          if (response.status === 200) {
            // User is signed in, set the username state
            setUsername(response.data.username);
          } else {
            // Token verification failed, clear the username state
            setUsername('');
          }
        } else {
          // Token not found, clear the username state
          setUsername('');
        }
      } catch (error) {
        // User is not signed in or token verification failed, clear the username state
        setUsername('');
      }
    };

    // Call the function to check if the user is signed in
    checkUserSignIn();
  }, []);

  const handleSignOut = async () => {
    try {
      // Clear the token from local storage or cookies
      // For example, if using local storage:
      localStorage.removeItem('token');

      // Send a POST request to the sign-out API endpoint
      await axios.post('/api/user/signout');

      // Clear the username state
      setUsername('');

      // Redirect to the sign-in page
      router.push('/signin');
    } catch (error) {
      console.log('Sign-out error:', error);
      // Handle sign-out errors, such as displaying an error message
    }
  };

  const handleSignInSuccess = (username, token) => {
    setUsername(username);
    localStorage.setItem('token', token);
    router.push('/');
  };

  return (
    <nav className="flex items-center justify-between w-full">
      <div className="flex items-center w-1/2 px-4 py-4">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <Image src={wealthEmpire} alt="logo" width={40} height={40} />
            <h1 className="text-xl font-bold px-4 logo-text">WEALTH EMPIRE EDUCATION</h1>
          </div>
        </Link>
      </div>
      <div className="flex items-center justify-between w-1/1">
        {username ? (
          <p className="text-sm font-bold color-white px-4 logo-text">Hello, {username}</p>
        ) : (
          <Link href="/signin">
            <p className="text-sm font-bold color-white px-4 logo-text">Sign In</p>
          </Link>
        )}
        {username && (
          <button className="text-sm font-bold color-white px-4 logo-text" onClick={handleSignOut}>
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
}
