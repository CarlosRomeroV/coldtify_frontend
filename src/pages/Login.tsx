import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storeTokens } from "../utils/auth";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access = params.get("access_token");
    const refresh = params.get("refresh_token");

    if (access && refresh) {
      storeTokens(access, refresh);
      navigate("/game");
    }
  }, [navigate]);

  const handleLogin = () => {
    window.location.href = "http://localhost:8888/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">🎵 Lyrics Game</h1>
      <button
        onClick={handleLogin}
        className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-xl text-xl"
      >
        Iniciar sesión con Spotify
      </button>
    </div>
  );
}

export default Login;
