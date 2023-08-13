// pages/login.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Login = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fullURL = window.location.href;
        console.log('Full URL:', fullURL);
    
        // Get the URL query parameters
        const queryParams = new URLSearchParams(window.location.search);
        const accessToken = queryParams.get('access_token');
    
        console.log('Access Token:', accessToken);
    
        // ... rest of your code ...
    }, []);
    
    

    const handleLogin = () => {
        window.location.href = 'https://discord.com/oauth2/authorize' +
            `?client_id=1139284541438165052` +
            `&redirect_uri=http://localhost:3000/login/` +
            `&response_type=code` +
            `&scope=identify%20guilds`;
    };

    const storeTokenInDatabase = async (token) => {
        try {
            const response = await fetch('/api/callback', {
                method: 'POST',
                body: JSON.stringify({ code: token }), // Send the token as "code"
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Token stored in database');
            } else {
                console.error('Failed to store token in database');
            }
        } catch (error) {
            console.error('Error storing token in database:', error);
        }
    };

    const fetchUserData = async (token) => {
        try {
            const response = await fetch('https://discord.com/api/v10/users/@me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                console.error('Failed to fetch user data from Discord API');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    return (
        <div>
            <h1>Login Page</h1>
            {user ? (
                <div>
                    <p>Welcome, {user.username}#{user.discriminator}!</p>
                    {/* Display user's data as needed */}
                </div>
            ) : (
                <div>
                    <p>Welcome to our website! Please log in using Discord:</p>
                    <button onClick={handleLogin}>Log in with Discord</button>
                </div>
            )}
        </div>
    );
};

export default Login;
