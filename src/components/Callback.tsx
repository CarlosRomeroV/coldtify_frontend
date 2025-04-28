// src/pages/Callback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Callback component mounted");
    console.log("URL actual:", window.location.href);

    const params = new URLSearchParams(window.location.search);
    const access = params.get("access_token");
    const refresh = params.get("refresh_token");
    const display = params.get("display_name");

    if (access && refresh && display) {
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("display_name", display);
      navigate("/game");
    } else {
      console.error("⚠️ Tokens no encontrados en la URL");
      navigate("/");
    }
  }, [navigate]);

  return <p className="text-white text-center mt-10">Procesando login...</p>;
}

export default Callback;
