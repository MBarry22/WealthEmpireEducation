
import fetch from 'node-fetch';
import db from '../../db'; // Import the database connection

const CLIENT_ID = '1139284541438165052';
const CLIENT_SECRET = 'Fqr6rBBft-ANIKbGeAub8ID66OwZ7_m5';
const REDIRECT_URI = 'http://localhost:3000/';

export default async function handler(req, res) {
    const code = req.query.code;

    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI,
            scope: 'identify', // Only identify scope is necessary here
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    const tokenData = await tokenResponse.json();

    // Store tokenData securely in MongoDB
    const Token = db.model('Token', {
        accessToken: String,
        refreshToken: String,
        expiresIn: Number,
        tokenType: String,
        scope: String,
    });

    const newToken = new Token({
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
        tokenType: tokenData.token_type,
        scope: tokenData.scope,
    });

    try {
        await newToken.save();
        res.redirect('/'); // Redirect to home page
    } catch (error) {
        console.error('Error storing token:', error);
        res.status(500).json({ error: 'Error storing token' });
    }
}
