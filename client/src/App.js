import React, { useState } from 'react';
import { detectMood } from './utils/moodDetector';

function App() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");

  const handleDetect = () => {
    const detected = detectMood(text);
    setMood(detected);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
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
      >
        Detect Mood
      </button>
      {mood && (
        <div className="mt-6 text-xl text-green-700">
          Detected mood: <strong>{mood}</strong>
        </div>
      )}
    </div>
  );
}

export default App;
