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
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        if (token && username) {
          setUsername(username);
        } else {
          // Redirect to the sign-in page if user data is not available
          router.push('/signin');
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
        // Redirect to the sign-in page if an error occurs
        router.push('/signin');
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = () => {
    // Clear the token and username from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // Redirect to the sign-in page
    router.push('/signin');
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
            <button onClick={handleSignOut}>
            <p className="text-sm font-bold color-white px-4 logo-text">Sign out</p>
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