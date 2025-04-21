import { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";

function User() {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [scores, setScores] = useState({
    score_game_1: 0,
    score_game_2: 0,
    score_game_3: 0
  });
  const [color, setColor] = useState<string>("#ffffff");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        // Obtener el spotify_id desde la API de Spotify
        const res = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        const spotifyId = data.id;
        localStorage.setItem("spotify_id", spotifyId);

        // Obtener datos del usuario desde Supabase
        const { data: user, error } = await supabase
          .from("users")
          .select("display_name, score_game_1, score_game_2, score_game_3, color")
          .eq("spotify_id", spotifyId)
          .single();

        if (user) {
          setDisplayName(user.display_name);
          setScores({
            score_game_1: user.score_game_1 || 0,
            score_game_2: user.score_game_2 || 0,
            score_game_3: user.score_game_3 || 0
          });
          setColor(user.color || "#ffffff");
        }

        if (error) {
          console.error("Error al consultar Supabase:", error.message);
        }
      } catch (err) {
        console.error("Error al obtener datos:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const handleSaveColor = async () => {
    const spotifyId = localStorage.getItem("spotify_id");
    if (!spotifyId) return;
  
    console.log("🎨 Guardando color:", color);
    console.log("🔑 Spotify ID:", spotifyId);
  
    const { error } = await supabase
      .from("users")
      .update({ color })
      .eq("spotify_id", spotifyId);
  
    if (error) {
      console.error("❌ Error al actualizar color favorito:", error.message);
    } else {
      console.log("✅ Color favorito actualizado correctamente.");
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white text-black p-6 rounded-xl shadow-lg w-full max-w-md text-center space-y-4">
        <img
          src="https://placehold.co/100x100"
          alt="Foto de perfil"
          className="mx-auto w-24 h-24 rounded-full shadow"
        />
        <h1 className="text-2xl font-bold">{displayName || "Usuario"}</h1>

        <div className="text-left">
          <h2 className="font-semibold mb-2">Puntuaciones:</h2>
          <p>🎮 Juego 1: {scores.score_game_1}</p>
          <p>🎮 Juego 2: {scores.score_game_2}</p>
          <p>🎮 Juego 3: {scores.score_game_3}</p>
        </div>

        <div className="text-left mt-4">
          <label className="font-semibold">🎨 Color favorito:</label>
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="ml-2 w-10 h-10 border-2 border-gray-300 rounded"
          />
          <button
            onClick={handleSaveColor}
            className="ml-4 mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

export default User;
