import React, { useState } from 'react';
import { detectMood } from './utils/moodDetector';
import { fetchPlaylist } from './utils/fetchPlaylist';

function App() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDetect = async () => {
    setLoading(true);
    const moodResult = detectMood(text);
    setMood(moodResult);
    try {
      const playlistResult = await fetchPlaylist(moodResult);
      setPlaylist(playlistResult);
    } catch (err) {
      console.error("Error fetching playlist:", err);
      setPlaylist(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">What's your vibe today?</h1>
      <textarea
        className="w-full max-w-md h-24 p-3 border rounded shadow-sm"
        placeholder="Type how you feel..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleDetect}
        disabled={loading}
      >
        {loading ? "Detecting..." : "Detect Mood & Get Playlist"}
      </button>

      {mood && (
        <div className="mt-4 text-lg">
          Detected mood: <strong>{mood}</strong>
        </div>
      )}

      {playlist && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Suggested Playlist</h2>
          <a
            href={playlist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <div className="transform hover:scale-105 transition-transform duration-200">
              <h3 className="text-2xl font-bold text-blue-600 hover:text-blue-800">
                {playlist.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600 hover:text-gray-800">
                Click to open on Spotify
              </p>
            </div>
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
