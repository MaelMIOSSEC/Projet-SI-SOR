import { useAuth } from "../hooks/useAuth.ts";
import { useNavigate } from "react-router";
import {
  CircleUser,
  TableOfContents,
  ShieldUser,
  ChartNoAxesColumn,
} from "lucide-react";
import { API_URL } from "../config/api.ts";
import { useState } from "react";

type SidebarState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; error: string };

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { logout } = useAuth();

  console.log("user => ", user);

  const isConnected = user !== null;

  const [state, setState] = useState<SidebarState>({ status: "idle" });

  const logoutUser = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isConnected) {
      logout();
      navigate("/");
    }
  };

  const handleDelete = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState({ status: "submitting" });

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/users/${user?.userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        alert("Erreur lors de la suppression du profil.");
        setState({
          status: "error",
          error: `Update failed (${response.status})`,
        });
        return;
      }

      logout();
      navigate("/");
    } catch (error) {
      setState({
        status: "error",

        error: error instanceof Error ? error.message : "Registration failed.",
      });
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
        {user?.isAdmin === true ? (
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
        ) : (
          <></>
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
