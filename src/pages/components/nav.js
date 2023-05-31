import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import Image from 'next/image';
import Link from 'next/link';
import wealthEmpire from '../components/images/wealthEmpire.png';

export default function Nav() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkUserSignIn = async () => {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set the Authorization header globally

          const response = await axios.get('/api/user/verify');

          if (response.status === 200) {
            setUsername(response.data.userId); // Update the state with the retrieved username
          } else {
            setUsername('');
          }
        } else {
          setUsername('');
        }
      } catch (error) {
        setUsername('');
        console.log('User verification error:', error);
      }
    };

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
          <>
            <p className="text-sm font-bold color-white px-4 logo-text">Hello, {username}</p>
            <button className="text-sm font-bold color-white px-4 logo-text" onClick={handleSignOut}>
              Sign Out
            </button>
          </>
        ) : (
          <Link href="/signin">
            <p className="text-sm font-bold color-white px-4 logo-text">Sign In</p>
          </Link>
        )}
      </div>
    </nav>
  );
}
