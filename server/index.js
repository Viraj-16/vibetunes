const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Spotify token generator
async function getAccessToken() {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data.access_token;
}

// Generate playlist route
app.get('/api/generate-playlist', async (req, res) => {
  const mood = req.query.mood || 'happy';

  const genreMap = {
    happy: ['pop', 'dance', 'happy'],
    sad: ['acoustic', 'piano', 'indie'],
    angry: ['rock', 'metal', 'trap'],
    relaxed: ['chill', 'ambient', 'lofi'],
    neutral: ['alternative', 'folk', 'indie']
  };

  try {
    const accessToken = await getAccessToken();
    const genres = genreMap[mood] || genreMap['neutral'];
    const query = genres.join('%20');

    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const playlist = response.data.playlists.items[0];
    res.json({ playlist });
  } catch (error) {
    console.error('Spotify API error:', error.message);
    res.status(500).json({ error: 'Failed to generate playlist' });
  }
});

// Connect to MongoDB first, then start server
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log("Connected to MongoDB");
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.error("MongoDB connection error:", err));

const History = require('./models/history');

app.post('/api/save-history', async (req, res) => {
  try {
    const { mood, playlist } = req.body;

    const entry = new History({
      mood,
      playlist: {
        name: playlist.name,
        id: playlist.id,
        url: playlist.external_urls.spotify,
        image: playlist.images?.[0]?.url || '',
      },
    });

    await entry.save();
    res.status(201).json({ message: 'History saved' });
  } catch (err) {
    console.error('Error saving history:', err.message);
    res.status(500).json({ error: 'Failed to save history' });
  }
});
