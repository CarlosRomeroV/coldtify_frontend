import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../utils/supabaseClient";

function Navbar() {
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.warn("❌ No hay token de acceso");
        return;
      }
  
      try {
        const res = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!res.ok) {
          console.warn("❌ Token de Spotify inválido. Código:", res.status);
          return;
        }
  
        const data = await res.json();
        const spotifyId = data.id;
        if (!spotifyId) return;
  
        localStorage.setItem("spotify_id", spotifyId);
  
        const { data: user, error } = await supabase
          .from("users")
          .select("display_name")
          .eq("spotify_id", spotifyId)
          .single();
  
        if (error) {
          console.error("❌ Supabase error:", error.message);
        }
  
        if (user) {
          setDisplayName(user.display_name);
        }
      } catch (err) {
        console.error("❌ Error inesperado:", err);
      }
    };
  
    fetchUser();
  }, []);
  

  return (
    <nav className="bg-green-500 shadow-lg text-white px-6 py-4 flex justify-between items-center fixed top-0 w-full z-50">
      
      {/* Nombre de usuario a la izquierda */}
      <div className="flex items-center gap-4">
        {displayName && (
          <span className="text-sm italic opacity-90">{displayName}</span>
        )}
      </div>
  
      {/* LyricsGame centrado */}
      <Link
        to="/"
        className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold tracking-tight"
      >
        LyricsGame
      </Link>
  
      {/* Navegación a la derecha */}
      <div className="flex gap-6 items-center text-lg">
        <Link to="/" className="hover:text-gray-300">Inicio</Link>
        <Link to="/game" className="hover:text-gray-300">Jugar</Link>
        <Link to="/ranking" className="hover:text-gray-300">Ranking</Link>
      </div>
    </nav>
  );
  
}

export default Navbar;
