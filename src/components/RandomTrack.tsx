import { useState } from "react";
import axios from "axios";

interface Props {
  accessToken: string;
}

interface Track {
  title: string;
  artist: string;
  albumImage: string;
  spotifyUrl: string;
  geniusUrl: string;
}

function RandomTrack({ accessToken }: Props) {
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchTrack = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/spotify/random-track`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTrack(res.data);
    } catch (err) {
      console.error("Error fetching track", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={fetchTrack}
        disabled={loading}
        className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl text-lg font-semibold transition-all mb-8 disabled:opacity-50"
      >
        {loading ? "Cargando..." : "Obtener canción"}
      </button>

      {track && (
        <div className="bg-white text-black rounded-2xl shadow-xl p-6 max-w-md w-full text-center">
          <img
            src={track.albumImage}
            alt={track.title}
            className="w-full rounded-xl mb-4"
          />
          <h2 className="text-2xl font-bold">{track.title}</h2>
          <p className="text-lg text-gray-700 mb-4">{track.artist}</p>
          <div className="flex justify-center gap-4">
            <a
              href={track.spotifyUrl}
              target="_blank"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl"
            >
              Spotify
            </a>
            <a
              href={track.geniusUrl}
              target="_blank"
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-xl"
            >
              Ver letra
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export default RandomTrack;
