import { useAuth } from "../hooks/useAuth.ts";
import { useNavigate } from "react-router";
import {
  CircleUser,
  TableOfContents,
  ShieldUser,
  ChartNoAxesColumn,
} from "lucide-react";
import { API_URL } from "../config/api.ts";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { logout } = useAuth();

  const isConnected = user !== null;

  const logoutUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  
    if (isConnected) {
      logout();
      navigate("/");
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    const userId = user?.userId;
  
    if (!token || !userId) {
      console.error("Token ou ID utilisateur manquant");
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        // essaye de lire le message d'erreur du serveur
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || "Erreur lors de la suppression du profil.");
        return;
      }
  
      logout();
      navigate("/");
    } catch (error) {
      console.error("Erreur réseau lors de la suppression du compte :", error);
      alert("Impossible de contacter le serveur.");
    }
  };

  return (
    <div
      style={{
        width: "25%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          color: "black",
          marginTop: "60px",
          textAlign: "start",
        }}
      >
        <a
          href="/profil"
          style={{
            fontSize: "x-large",
            textDecoration: "none",
            color: "black",
            margin: "10px 0",
            paddingLeft: "60px",
            textTransform: "uppercase",
          }}
        >
          <CircleUser /> Informations
        </a>
        <a
          href="/boards"
          style={{
            fontSize: "x-large",
            textDecoration: "none",
            color: "black",
            margin: "10px 0",
            paddingLeft: "60px",
            textTransform: "uppercase",
          }}
        >
          <TableOfContents /> Tableaux
        </a>
        {user?.isAdmin && (
          <>
            <a
              href="/accountManagment"
              style={{
                fontSize: "x-large",
                textDecoration: "none",
                color: "black",
                margin: "10px 0",
                paddingLeft: "60px",
                textTransform: "uppercase",
              }}
            >
              <ShieldUser /> Gestion des comptes
            </a>
            <a
              href="/statistics"
              style={{
                fontSize: "x-large",
                textDecoration: "none",
                color: "black",
                margin: "10px 0",
                paddingLeft: "60px",
                textTransform: "uppercase",
              }}
            >
              <ChartNoAxesColumn /> Statistiques
            </a>
          </>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button
          onClick={logoutUser}
          type="button"
          className="btn btn-primary"
          style={{
            margin: "10px",
            borderRadius: "15px",
            fontSize: "20px",
            height: "50px",
          }}
        >
          Déconnexion
        </button>
        <button
          onClick={handleDelete}
          type="button"
          className="btn btn-danger"
          style={{
            margin: "10px",
            borderRadius: "15px",
            fontSize: "20px",
            height: "50px",
          }}
        >
          Suppression du compte
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
