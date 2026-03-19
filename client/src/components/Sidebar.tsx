import { useAuth } from "../hooks/useAuth.ts";
import { useNavigate } from "react-router-dom";
import {
  CircleUser,
  TableOfContents,
  ShieldUser,
  ChartNoAxesColumn,
} from "lucide-react";
import { API_URL } from "../config/api.ts";
import "../index.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout, authFetch } = useAuth();

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

    const confirmation = globalThis.confirm(
      "Voulez-vous vraiment supprimer ce compte ?",
    );

    if (!confirmation) return;
  
    const userId = user?.userId;
  
    if (!userId) {
      console.error("ID utilisateur manquant");
      return;
    }
  
    try {
      const response = await authFetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
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
    <div className="sidebar-container">
      <div className="sidebar-nav">
        <a href="/profil" className="sidebar-link">
          <CircleUser /> Informations
        </a>
        <a href="/boards" className="sidebar-link">
          <TableOfContents /> Tableaux
        </a>
        {user?.isAdmin && (
          <>
            <a href="/accountManagment" className="sidebar-link">
              <ShieldUser /> Gestion des comptes
            </a>
            <a href="/statistics" className="sidebar-link">
              <ChartNoAxesColumn /> Statistiques
            </a>
          </>
        )}
      </div>
      <div className="sidebar-actions">
        <button
          onClick={logoutUser}
          type="button"
          className="btn btn-primary sidebar-btn"
        >
          Déconnexion
        </button>
        <button
          onClick={handleDelete}
          type="submit"
          className="btn btn-danger sidebar-btn"
        >
          Suppression du compte
        </button>
      </div>
    </div>
  );
};

export default Sidebar;