import { BrowserRouter, Route, Routes } from "react-router";

import Login from "./pages/Authentification/Login.tsx";
import Register from "./pages/Authentification/Register.tsx";
import Index from "./pages/Index.tsx";
import Profil from "./pages/Profil.tsx";
import Navbar from "./components/Navbar.tsx";
import AccountManagement from "./pages/AccountManagement.tsx";
import Boards from "./pages/Boards.tsx";
import Statistics from "./pages/Statistics.tsx";
import AuthProvider from "./contexts/AuthProvider.tsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
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
