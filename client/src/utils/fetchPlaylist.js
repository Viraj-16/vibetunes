import axios from "axios";

export async function fetchPlaylist(mood) {
  const response = await axios.get(`http://localhost:5000/api/generate-playlist`, {
    params: { mood }
  });
  return response.data.playlist;
}
