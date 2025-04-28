import { useState, useEffect } from "react";
import axios from "axios";

interface Album {
  name: string;
  image: string;
}

const normalize = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
};

const AlbumGuessGame = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await axios.get(`${backendUrl}/spotify/top-albums`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setAlbums(res.data);
      } catch (error) {
        console.error("Error al cargar álbumes:", error);
      }
    };

    fetchAlbums();
  }, []);

  const handleGuess = () => {
    const correctTitle = normalize(albums[currentRound].name);
    const userGuess = normalize(guess);

    if (correctTitle === userGuess) {
      setScore(score + 3);
      setLastResult("✅ ¡Correcto!");
    } else {
      setLastResult(`❌ Era: "${albums[currentRound].name}"`);
    }

    setTimeout(() => {
      if (currentRound === 9) {
        updateScore(); // 👈 Al acabar la partida, actualizamos Supabase
        setIsFinished(true);
      } else {
        setGuess("");
        setLastResult(null);
        setCurrentRound(currentRound + 1);
      }
    }, 1500);
  };

  const updateScore = async () => {
    const spotifyId = localStorage.getItem("spotify_id");
    if (!spotifyId) {
      console.error("Spotify ID no encontrado en localStorage");
      return;
    }

    try {
      await axios.post(`${backendUrl}/user/update-score`, {
        spotify_id: spotifyId,
        score: score,
      });
      console.log("✅ Puntuación actualizada correctamente en Supabase");
    } catch (error) {
      console.error("❌ Error al actualizar puntuación en Supabase:", error);
    }
  };

  if (albums.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 text-white flex items-center justify-center text-2xl">
        🔄 Cargando álbumes...
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 text-white flex flex-col items-center justify-center space-y-6 px-4">
        <h2 className="text-4xl font-extrabold text-green-400 animate-fade-in">🎉 ¡Partida terminada!</h2>
        <p className="text-2xl">Puntuación final: <span className="font-bold">{score} puntos</span></p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition duration-300"
        >
          Jugar otra vez
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 text-white flex flex-col items-center justify-center px-4 py-10">
      <div className="bg-white text-black p-8 rounded-2xl shadow-2xl max-w-xl w-full space-y-6 animate-fade-in-slow">
        <h2 className="text-3xl font-bold text-center">🎶 Ronda {currentRound + 1} / 10</h2>

        <div className="flex justify-center">
          <img
            src={albums[currentRound].image}
            alt="Album Cover"
            className="w-64 h-64 object-cover rounded-lg shadow-lg blur-xl hover:blur-none transition duration-700"
          />
        </div>

        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="¿Nombre del álbum?"
          className="w-full px-5 py-3 rounded-xl border-2 border-blue-400 focus:outline-none focus:border-blue-600 text-center text-lg"
        />

        <div className="flex justify-center">
          <button
            onClick={handleGuess}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-8 rounded-xl transition duration-300"
          >
            Adivinar
          </button>
        </div>

        {lastResult && (
          <div className="mt-4 text-2xl font-bold text-center">
            {lastResult}
          </div>
        )}

        <p className="mt-4 text-center text-xl font-semibold">
          Puntos: <span className="text-blue-700">{score}</span>
        </p>
      </div>
    </div>
  );
};

export default AlbumGuessGame;
