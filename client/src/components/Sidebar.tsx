import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import {
  CircleUser,
  TableOfContents,
  ShieldUser,
  ChartNoAxesColumn,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { logout } = useAuth();

  const isConnected = user !== null;

  const logoutUser = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isConnected) {
      logout(user);
      navigate("/");
    }
  };

  return (
    <div
      style={{
        border: "1px solid",
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
            border: "1px solid",
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
          href=""
          style={{
            border: "1px solid",
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
        {user.isAdmin === true ? (
          <>
            <a
              href=""
              style={{
                border: "1px solid",
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
              href=""
              style={{
                border: "1px solid",
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
        onClick={ logoutUser }
          type="button"
          class="btn btn-primary"
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
}

export default Sidebar;