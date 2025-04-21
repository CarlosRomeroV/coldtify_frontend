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

function LyricsPreview({ accessToken }: Props) {
  const [track, setTrack] = useState<Track | null>(null);
  const [verse, setVerse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchTrackWithLyrics = async () => {
    setLoading(true);
    setVerse(null); // resetear anterior
    try {
      // 1. Obtener canción aleatoria
      const trackRes = await axios.get(`${backendUrl}/spotify/random-track`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data: Track = trackRes.data;
      setTrack(data);

      // 2. Obtener primer verso desde geniusUrl
      const verseRes = await axios.get(`${backendUrl}/genius/first-verse`, {
        params: { url: data.geniusUrl },
      });

      setVerse(verseRes.data.firstVerse || "No se encontró letra.");
    } catch (error) {
      console.error("Error:", error);
      setVerse("Error al obtener la letra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center mt-10">
      <button
        onClick={fetchTrackWithLyrics}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl mb-6"
      >
        {loading ? "Cargando..." : "🎤 Obtener canción + letra"}
      </button>

      {track && (
        <div className="bg-white text-black rounded-xl p-6 shadow-lg max-w-md mx-auto">
          <img src={track.albumImage} alt={track.title} className="rounded-lg mb-4" />
          <h2 className="text-xl font-bold">{track.title}</h2>
          <p className="text-gray-600">{track.artist}</p>

          <div className="mt-4 text-left">
            <p className="text-gray-500 italic mb-1">Primera estrofa:</p>
            <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap text-sm">{verse}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default LyricsPreview;
