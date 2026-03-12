import { BrowserRouter, Route, Routes } from "react-router";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Index from "./pages/Index";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
