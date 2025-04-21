import { Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu";
import Game from "./pages/Game";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Ranking from "./pages/Ranking";
import User from "./pages/User";
import Callback from "./components/Callback";

function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/game" element={<Game />} />
      <Route path="/login" element={<Login />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/profile" element={<User />} />
      <Route path="/callback" element={<Callback />} />
    </Routes>
    </>
  );
}

export default App;
