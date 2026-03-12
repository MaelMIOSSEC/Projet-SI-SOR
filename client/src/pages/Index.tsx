import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isConnected = user !== null;

  if (isConnected) {
    return <h1>SALUT</h1>;
  } else {
    navigate("/login");
  }
}
