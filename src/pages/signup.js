import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('');
  
    const router = useRouter();
  
    const handleSignUp = async (e) => {
      e.preventDefault();
  
      try {
        // Send a POST request to the sign-up API endpoint
        const response = await axios.post('/api/user/create-user', {
          username,
          password,
          firstName,
          lastName,
          email,
          phoneNumber,
          address,
          role,
        });
  
        // Redirect to the home page or the desired destination
        router.push('/');
      } catch (error) {
        console.log('Sign-up error:', error);
        // Handle sign-up errors, such as displaying an error message
      }
    };
  
    return (
      <div>
        <h1>Sign Up</h1>
        <form onSubmit={handleSignUp}>
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <label htmlFor="firstName">First Name:</label>
            <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="lastName">Last Name:</label>
            <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    );
  }
  
