
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { getAccessToken, storeTokens } from "../utils/auth";

interface Track {
  title: string;
  artist: string;
  albumImage: string;
  spotifyUrl: string;
  geniusUrl: string;
}

const TOTAL_ROUNDS = 10;

function Game() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [track, setTrack] = useState<Track | null>(null);
  const [verse, setVerse] = useState<string | null>(null);
  const [verseWords, setVerseWords] = useState<string[]>([]);
  const [hiddenIndexes, setHiddenIndexes] = useState<number[]>([]);
  const [inputs, setInputs] = useState<{ [index: number]: string }>({});
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [showingResult, setShowingResult] = useState(false);
  const [correctInputs, setCorrectInputs] = useState<{ [index: number]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [spotifyId, setSpotifyId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessFromUrl = urlParams.get("access_token");
      const refreshFromUrl = urlParams.get("refresh_token");
      const nameFromUrl = urlParams.get("display_name");
      if (nameFromUrl) localStorage.setItem("display_name", nameFromUrl);

      if (accessFromUrl && refreshFromUrl) {
        console.log("💾 Guardando tokens desde la URL");
        storeTokens(accessFromUrl, refreshFromUrl);
        setAccessToken(accessFromUrl);
        window.history.replaceState({}, document.title, "/game");
      } else {
        const token = await getAccessToken();
        if (token) {
          setAccessToken(token);
        } else {
          console.warn("❌ Token no disponible");
        }
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const fetchSpotifyId = async () => {
      if (!accessToken) return;
      try {
        const res = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        setSpotifyId(data.id);
      } catch (error) {
        console.error("Error obteniendo spotify_id:", error);
      }
    };

    fetchSpotifyId();
  }, [accessToken]);

  const loadRound = async () => {
    setIsLoading(true);
    setTrack(null);
    setVerse(null);

    try {
      if (!accessToken) {
        console.error("Token no disponible");
        return;
      }

      const trackRes = await axios.get(`${backendUrl}/spotify/random-track`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const trackData: Track = trackRes.data;
      setTrack(trackData);

      const verseRes = await axios.get(`${backendUrl}/genius/random-verse`, {
        params: { url: trackData.geniusUrl },
      });

      const text: string = verseRes.data.firstVerse || verseRes.data.verse || "Letra no encontrada.";
      const words = text.split(/\s+/);

      const validIndexes = words
        .map((w, i) => ({ word: w, i }))
        .filter(({ word }) => /^[a-zA-Z]{4,}$/.test(word))
        .map(({ i }) => i);

      const shuffled = [...validIndexes].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);

      setVerse(text);
      setVerseWords(words);
      setHiddenIndexes(selected);
      setInputs({});
    } catch (error) {
      console.error("Error al cargar la ronda:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && round <= TOTAL_ROUNDS) {
      loadRound();
    }
  }, [round, accessToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    setInputs({ ...inputs, [index]: e.target.value });
  };

  const handleVerify = () => {
    const newCorrectInputs: { [index: number]: boolean } = {};
    let newPoints = 0;

    hiddenIndexes.forEach((i) => {
      const input = (inputs[i] || "").trim().toLowerCase();
      const actual = verseWords[i].toLowerCase();
      const isCorrect = input === actual;
      newCorrectInputs[i] = isCorrect;
      if (isCorrect) newPoints++;
    });

    setCorrectInputs(newCorrectInputs);
    setScore(prev => prev + newPoints);
    setShowingResult(true);

    setTimeout(async () => {
      setShowingResult(false);
      const finalScore = score + newPoints;

      if (round < TOTAL_ROUNDS) {
        setRound(prev => prev + 1);
      } else {
        setCompleted(true);
        if (spotifyId) {
          try {
            await fetch(`${backendUrl}/user/update-score`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ spotify_id: spotifyId, score: finalScore }),
            });
            console.log("✅ Puntuación enviada correctamente.");
          } catch (err) {
            console.error("❌ Error al enviar puntuación:", err);
          }
        }
      }
    }, 3000);
  };

  const handleRestart = () => {
    setScore(0);
    setRound(1);
    setCompleted(false);
    setTrack(null);
    setVerse(null);
    setVerseWords([]);
    setHiddenIndexes([]);
    setInputs({});
    setCorrectInputs({});
    setIsLoading(true);
    loadRound();
  };

  if (isLoading || !track || !verse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-900 text-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-900 text-white flex flex-col items-center justify-center px-4 py-8">
      {!completed ? (
        <>
          <h2 className="text-xl mb-2 font-semibold">Ronda {round} / {TOTAL_ROUNDS}</h2>
          <h3 className="text-lg mb-4">Puntuación: {score}</h3>
          <img
            src={track.albumImage}
            alt={track.title}
            className={`w-24 h-24 rounded shadow-lg mb-4 ${showingResult ? "blur-0 brightness-100" : "blur-sm brightness-75"}`}
          />
          <div className="bg-white text-black p-6 rounded-xl shadow-lg max-w-xl w-full mb-4">
            <p className="text-left whitespace-pre-wrap leading-7 text-lg break-words">
              {verseWords.map((word, idx) => {
                const userInput = inputs[idx] || "";
                const isCorrect = correctInputs[idx];
                let inputClass = "border-gray-500";

                if (showingResult) {
                  inputClass = isCorrect
                    ? "border-green-500 bg-green-100"
                    : "border-red-500 bg-red-100";
                }

                if (hiddenIndexes.includes(idx)) {
                  if (showingResult && !isCorrect) {
                    return <span key={idx} className="mx-1 underline text-red-600 font-semibold">{verseWords[idx]}</span>;
                  } else {
                    return (
                      <input
                        key={idx}
                        type="text"
                        value={userInput}
                        onChange={(e) => handleChange(e, idx)}
                        disabled={showingResult}
                        className={`inline-block w-20 mx-1 border-b-2 px-2 py-1 text-center rounded ${inputClass}`}
                      />
                    );
                  }
                } else {
                  return <span key={idx} className="mx-1">{word}</span>;
                }
              })}
            </p>
          </div>
          <button
            onClick={handleVerify}
            className="bg-green-500 hover:bg-green-700 px-6 py-2 rounded-xl text-white"
          >
            Verificar
          </button>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">🎉 Juego completado</h2>
          <p className="text-xl mb-6">Puntuación final: {score} / {TOTAL_ROUNDS * 3}</p>
          <button
            onClick={handleRestart}
            className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-xl text-white"
          >
            Volver a jugar
          </button>
          <button
            onClick={() => navigate("/")}
            className="ml-4 bg-gray-500 hover:bg-gray-600 px-6 py-3 rounded-xl text-white"
          >
            Volver al menú
          </button>
        </div>
      )}
    </div>
  );
}

export default Game;
