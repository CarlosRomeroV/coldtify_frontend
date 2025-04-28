import { Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Ranking from "./pages/Ranking";
import User from "./pages/User";
import Callback from "./components/Callback";
import AlbumGuessGame from "./components/AlbumGuessGame";

function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/game" element={<AlbumGuessGame />} />
      <Route path="/login" element={<Login />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/profile" element={<User />} />
      <Route path="/callback" element={<Callback />} />
    </Routes>
    </>
  );
}

export default App;
