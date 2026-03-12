import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { API_URL } from "../config/api";
import Sidebar from "../components/Sidebar";

type ProfilState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; error: string };

export default function Profil() {
  const { user } = useAuth();

  const [state, setState] = useState<ProfilState>({ status: "idle" });

  const handleUpdate = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setState({ status: "submitting" });

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");
    const name = formData.get("name");
    const lastName = formData.get("lastName");
    const email = formData.get("email");

    try {
      const res = await fetch(`${API_URL}/users/${user.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, name, lastName, email }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const apiResponse = await res.json();

      if (apiResponse.ok) {
        alert("Profil mis à jour avec succès !");
      } else {
        alert("Erreur lors de la mise à jour du profil.");
      }
    } catch (error) {
      setState({
        status: "error",
        error: error instanceof Error ? error.message : "Registration failed.",
      });
    }
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "row",
        marginTop: "63px",
        border: "1px solid",
        height: "800px",
      }}
    >
      <Sidebar />
      <div
        style={{
          border: "1px solid",
          width: "75%",
          margin: "40px",
        }}
      >
        <h1>Bonjour, {user.name}</h1>
        <div
          style={{
            borderRadius: "25px",
            border: "1px solid",
            margin: "60px 200px",
          }}
        >
          <form
            onSubmit={ handleUpdate }
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div style={{ margin: "10px 0", width: "510px" }}>
              <p
                style={{
                  margin: "0",
                  textAlign: "left",
                  color: "grey",
                  fontSize: "14px",
                  opacity: "80%",
                }}
              >
                Username*
              </p>
              <input
                style={{ width: "510px", height: "40px", fontSize: "16px" }}
                type="text"
                name="username"
                required
                value={user.username}
              />
            </div>
            <div style={{ margin: "10px 0", width: "510px" }}>
              <p
                style={{
                  margin: "0",
                  textAlign: "left",
                  color: "grey",
                  fontSize: "14px",
                  opacity: "80%",
                }}
              >
                Password*
              </p>
              <input
                style={{ width: "510px", height: "40px", fontSize: "16px" }}
                type="password"
                name="password"
                required
                value={user.password}
              />
            </div>
            <div
              style={{
                display: "flex",
                margin: "10px 0",
                width: "510px",
                flexDirection: "row",
              }}
            >
              <div>
                <p
                  style={{
                    margin: "0",
                    textAlign: "left",
                    color: "grey",
                    fontSize: "14px",
                    opacity: "80%",
                  }}
                >
                  Name*
                </p>
                <input
                  style={{ width: "230px", height: "40px", fontSize: "16px" }}
                  type="text"
                  name="name"
                  required
                  value={user.name}
                />
              </div>
              <div style={{ padding: "0 48px" }}>
                <p
                  style={{
                    margin: "0",
                    textAlign: "left",
                    color: "grey",
                    fontSize: "14px",
                    opacity: "80%",
                  }}
                >
                  LastName*
                </p>
                <input
                  style={{ width: "230px", height: "40px", fontSize: "16px" }}
                  type="text"
                  name="lastName"
                  required
                  value={user.lastName}
                />
              </div>
            </div>
            <div style={{ margin: "10px 0", width: "510px" }}>
              <p
                style={{
                  margin: "0",
                  textAlign: "left",
                  color: "grey",
                  fontSize: "14px",
                  opacity: "80%",
                }}
              >
                Email*
              </p>
              <input
                style={{ width: "510px", height: "40px", fontSize: "16px" }}
                type="text"
                name="email"
                required
                value={user.email}
              />
            </div>
            <button
              type="submit"
              style={{
                width: "510px",
                height: "50px",
                fontSize: "16px",
                margin: "15px 0",
              }}
            >
              Modifier
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
