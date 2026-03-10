import { BrowserRouter, Route } from "react-router";

import Login from "./pages/Login";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Route path="/" element={<Login />} />
    </BrowserRouter>
  )
}

export default App
