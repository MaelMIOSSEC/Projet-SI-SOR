import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { URL_TOMCAT } from "../config/api";
import Sidebar from "../components/Sidebar";

type ProfilState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; error: string };

export default function Profil() {
  const { user, setUser } = useAuth();

  const [state, setState] = useState<ProfilState>({ status: "idle" });
  const [formData, setFormData] = useState(user);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState({ status: "submitting" });

    const data = {
      username: formData.username,
      password: formData.password,
      name: formData.name,
      lastName: formData.lastName,
      email: formData.email,
      isAdmin: formData.isAdmin ? 1 : 0,
      createdAt: formData.createdAt,
    };

    try {
      const res = await fetch(`${URL_TOMCAT}/users/${user.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        alert("Erreur lors de la mise à jour du profil.");
        return;
      }

      const updatedUserFromServer = await res.json();

      if (setUser) {
        // IMPORTANT : On passe l'objet complet mis à jour pour déclencher le re-rendu
        setUser({
          ...user,
          username: updatedUserFromServer.username,
          name: updatedUserFromServer.name,
          lastName: updatedUserFromServer.lastName,
          email: updatedUserFromServer.email,
          isAdmin: updatedUserFromServer.isAdmin,
        });
      }

      alert("Profil mis à jour avec succès !");
      setState({ status: "idle" });
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
            onSubmit={handleUpdate}
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
                value={formData.username}
                onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
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
                  value={formData.name}
                  onChange={handleChange}
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
                  value={formData.lastName}
                  onChange={handleChange}
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
                value={formData.email}
                onChange={handleChange}
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
