import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./pages/Authentification/Login.tsx";
import Register from "./pages/Authentification/Register.tsx";
import Index from "./pages/Index.tsx";
import Profil from "./pages/Profil/Profil.tsx";
import Navbar from "./components/Navbar.tsx";
import AccountManagement from "./pages/Profil/AccountManagement.tsx";
import Boards from "./pages/Profil/Boards.tsx";
import Statistics from "./pages/Profil/Statistics.tsx";
import AuthProvider from "./contexts/AuthProvider.tsx";
import BoardDetails from "./pages/BoardDetails.tsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/board/:boardId" element={<BoardDetails />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/accountManagment" element={<AccountManagement />} />
          <Route path="/boards" element={<Boards />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
