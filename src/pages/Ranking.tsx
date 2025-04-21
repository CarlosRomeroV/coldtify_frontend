import { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";
import { applyNameEffect } from "../utils/applyNameEffect";
import { getProfilePictureUrl } from "../utils/getProfilePicture";

interface User {
  display_name: string;
  score_game_1: number;
  score_game_2: number;
  score_game_3: number;
  color: string;
  name_effect: number;
  profile_pic: string;
}

function isDarkColor(hexColor: string): boolean {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

function Ranking() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("display_name, score_game_1, score_game_2, score_game_3, color, name_effect, profile_pic");

      if (error) {
        console.error("❌ Error al obtener ranking:", error);
      }

      if (data) {
        const sorted = [...data].sort((a, b) => {
          const totalA = (a.score_game_1 || 0) + (a.score_game_2 || 0) + (a.score_game_3 || 0);
          const totalB = (b.score_game_1 || 0) + (b.score_game_2 || 0) + (b.score_game_3 || 0);
          return totalB - totalA;
        });

        setUsers(sorted);
      }

      setLoading(false);
    };

    fetchRanking();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">🏆 Clasificación Global</h1>

      <div className="flex gap-4 mb-6">
        <button className="bg-green-600 px-4 py-2 rounded text-white font-semibold shadow">General</button>
        <button className="bg-gray-600 px-4 py-2 rounded text-white opacity-70 cursor-not-allowed">Juego 1</button>
        <button className="bg-gray-600 px-4 py-2 rounded text-white opacity-70 cursor-not-allowed">Juego 2</button>
        <button className="bg-gray-600 px-4 py-2 rounded text-white opacity-70 cursor-not-allowed">Juego 3</button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] font-bold border-b border-gray-300 pb-2 mb-2">
            <div>#</div>
            <div className="flex items-center justify-center gap-2">
              Jugador
            </div>
            <div className="text-center">🎮 1</div>
            <div className="text-center">🎮 2</div>
            <div className="text-center">🎮 3</div>
            <div className="text-center">✨ Total</div>
          </div>


          {users.map((user, index) => {
            const score1 = user.score_game_1 ?? 0;
            const score2 = user.score_game_2 ?? 0;
            const score3 = user.score_game_3 ?? 0;
            const total = score1 + score2 + score3;

            const backgroundColor = user.color || "#4b0082";
            const isDark = isDarkColor(backgroundColor);
            const textColor = isDark ? "white" : "black";
            const profileUrl = getProfilePictureUrl(user.profile_pic);

            return (
              <div
                key={index}
                className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] items-center p-3 rounded-lg shadow mb-2"

                style={{ backgroundColor, color: textColor }}
              >
                <div className="font-bold">#{index + 1}</div>
                <div className="flex items-center justify-center gap-3">
                  <img
                    src={profileUrl}
                    alt="Perfil"
                    className="w-10 h-10 rounded-md border border-white object-cover"
                  />
                  <span className="text-xl font-bold">
                    {applyNameEffect(user.display_name, user.name_effect)}
                  </span>
                </div>
                <div className="text-center">{score1}</div>
                <div className="text-center">{score2}</div>
                <div className="text-center">{score3}</div>
                <div className="text-center font-bold">{total}</div>
              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}

export default Ranking;
