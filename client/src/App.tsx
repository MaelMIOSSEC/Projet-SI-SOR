import { BrowserRouter, Route, Routes } from "react-router";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Index from "./pages/Index";
import Profil from "./pages/Profil";
import Navbar from "./components/Navbar";
import AuthProvider from "./contexts/AuthProvider";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
