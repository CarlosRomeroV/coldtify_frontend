import { useNavigate } from "react-router-dom";

function Menu() {
  const navigate = useNavigate();

  const buttons = [
    {
      label: "Jugar",
      color: "bg-red-500 hover:bg-red-600",
      path: "/game",
    },
    {
      label: "Clasificaciones",
      color: "bg-blue-500 hover:bg-blue-600",
      path: "/ranking",
    },
    {
      label: "Perfil",
      color: "bg-green-500 hover:bg-green-600",
      path: "/profile", // en un futuro
    },
    {
      label: "Ajustes",
      color: "bg-yellow-500 hover:bg-yellow-600",
      path: "/settings", // en un futuro
    },
    {
      label: "Créditos",
      color: "bg-purple-500 hover:bg-purple-600",
      path: "/credits", // en un futuro
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 text-white flex items-center justify-center px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {buttons.map((btn, i) => (
          <button
            key={i}
            onClick={() => navigate(btn.path)}
            className={`${btn.color} py-10 px-6 text-2xl font-bold rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Menu;
