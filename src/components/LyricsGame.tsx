import { useState } from "react";
import axios from "axios";

interface Props {
  accessToken: string;
}

function LyricsGame({ accessToken }: Props) {
  const [verse, setVerse] = useState<string | null>(null);
  const [verseWords, setVerseWords] = useState<string[]>([]);
  const [hiddenIndexes, setHiddenIndexes] = useState<number[]>([]);
  const [inputs, setInputs] = useState<{ [index: number]: string }>({});
  const [correctInputs, setCorrectInputs] = useState<{ [index: number]: boolean }>({});
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchVerse = async () => {
    setLoading(true);
    setResult(null);
    setCorrectInputs({});
    try {
      const trackRes = await axios.get(`${backendUrl}/spotify/random-track`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const geniusUrl = trackRes.data.geniusUrl;

      const verseRes = await axios.get(`${backendUrl}/genius/first-verse`, {
        params: { url: geniusUrl },
      });

      const text: string = verseRes.data.firstVerse;

      const words = text.split(/\s+/);
      const validIndexes = words
        .map((w, i) => ({ word: w, i }))
        .filter(({ word }) => /^[a-zA-Z']{4,}$/.test(word))
        .map(({ i }) => i);

      const shuffled = [...validIndexes].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);

      setVerse(text);
      setVerseWords(words);
      setHiddenIndexes(selected);
      setInputs({});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    setInputs({ ...inputs, [index]: e.target.value });
    const updated = { ...correctInputs };
    delete updated[index];
    setCorrectInputs(updated);

  };

  const handleVerify = () => {
    const newCorrectInputs: { [index: number]: boolean } = {};
    let allCorrect = true;

    hiddenIndexes.forEach((i) => {
      const input = (inputs[i] || "").trim().toLowerCase();
      const actual = verseWords[i].toLowerCase();
      const isCorrect = input === actual;
      newCorrectInputs[i] = isCorrect;
      if (!isCorrect) allCorrect = false;
    });

    setCorrectInputs(newCorrectInputs);
    setResult(allCorrect ? "✅ ¡Correcto!" : "❌ Intenta de nuevo");
  };

  return (
    <div className="text-center mt-10 max-w-xl mx-auto">
      <button
        onClick={fetchVerse}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl mb-6"
      >
        {loading ? "Cargando..." : "🎮 Empezar juego"}
      </button>

      {verse && (
        <div className="bg-white text-black p-6 rounded-xl shadow-lg">
          <p className="mb-6 text-left whitespace-pre-wrap leading-7 text-lg max-h-64 overflow-hidden break-words">
            {verseWords.map((word, idx) => {
              if (hiddenIndexes.includes(idx)) {
                const userInput = inputs[idx] || "";
                const isCorrect = correctInputs[idx];
                const borderColor = isCorrect === undefined
                  ? "border-gray-500"
                  : isCorrect
                  ? "border-green-500 bg-green-100"
                  : "border-red-500 bg-red-100";

                return (
                  <input
                    key={idx}
                    type="text"
                    value={userInput}
                    onChange={(e) => handleChange(e, idx)}
                    className={`inline-block w-20 mx-1 border-b-2 px-2 py-1 text-center rounded ${borderColor} focus:outline-none`}
                  />
                );
              } else {
                return <span key={idx} className="mx-1">{word}</span>;
              }
            })}
          </p>

          <button
            onClick={handleVerify}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl"
          >
            Verificar
          </button>

          {result && (
            <div className="mt-4 text-xl font-bold">{result}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default LyricsGame;
