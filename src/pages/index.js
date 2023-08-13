// pages/index.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
    const router = useRouter();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const accessToken = router.query.access_token;

        if (accessToken) {
            fetchUserData(accessToken);
        }
    }, [router.query.access_token]);

    const fetchUserData = (token) => {
        fetch('https://discord.com/api/v10/users/@me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            setUserData(data);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
    };

    return (
        <div>
            <h1>Home Page</h1>
            {userData ? (
                <div>
                    <p>Welcome, {userData.username}#{userData.discriminator}!</p>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default Home;
