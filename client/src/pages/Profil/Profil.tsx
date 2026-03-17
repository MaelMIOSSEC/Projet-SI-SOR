import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth.ts";
import { API_URL } from "../../config/api.ts";
import Sidebar from "../../components/Sidebar.tsx";
import type { User } from "../../types/userType.ts";

type ProfilState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; error: string };

interface UserFormData extends Partial<User> {
  newPassword?: string;
  confirmPassword?: string;
}

export default function Profil() {
  const { user, setUser } = useAuth();

  const [state, setState] = useState<ProfilState>({ status: "idle" });
  
  const [formData, setFormData] = useState<UserFormData>(
    user ? { ...user, newPassword: "", confirmPassword: "" } : {},
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState({ status: "submitting" });

    const payload = {
      username: formData.username || user?.username,
      password: user?.password,
      name: formData.name || user?.name,
      lastName: formData.lastName || user?.lastName,
      email: formData.email || user?.email,
      isAdmin: formData.isAdmin ? 1 : 0,
      createdAt: formData.createdAt || user?.createdAt,
    };

    if (formData.newPassword && formData.newPassword !== "") {
      if (formData.newPassword !== formData.confirmPassword) {
        alert("Les nouveaux mots de passe ne correspondent pas");
        setState({ status: "idle" });
        return;
      }
      payload.password = formData.newPassword;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/users/${user?.userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorMsg = "Erreur lors de la mise à jour du profil.";
        alert(errorMsg);
        setState({ status: "error", error: errorMsg });
        return;
      }

      const updatedUserFromServer = await response.json();

      if (setUser && user) {
        setUser({
          ...user,
          username: updatedUserFromServer.username,
          name: updatedUserFromServer.name,
          lastName: updatedUserFromServer.lastName,
          email: updatedUserFromServer.email,
          isAdmin: updatedUserFromServer.isAdmin === 1,
        });
      }

      alert("Profil mis à jour avec succès !");
      setState({ status: "idle" });
    } catch (error) {
      setState({
        status: "error",
        error: error instanceof Error ? error.message : "Update failed.",
      });
    }
  };

  return (
    <main style={{ display: "flex", flexDirection: "row", marginTop: "63px", height: "800px" }}>
      <Sidebar />
      <div style={{ width: "75%", margin: "40px" }}>
        <h1>Bonjour, {user?.name}</h1>
        <div style={{ borderRadius: "25px", margin: "60px 200px" }}>
          <form onSubmit={handleUpdate} style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            
            <div style={{ margin: "10px 0", width: "510px" }}>
              <p style={{ margin: "0", textAlign: "left", color: "grey", fontSize: "14px", opacity: "0.8" }}>Username*</p>
              <input
                style={{ width: "510px", height: "40px", fontSize: "16px" }}
                type="text"
                name="username"
                required
                value={formData.username || ""}
                onChange={handleChange}
                disabled={state.status === "submitting"}
              />
            </div>

            <div style={{ margin: "10px 0", width: "510px" }}>
              <p style={{ margin: "0", textAlign: "left", color: "grey", fontSize: "14px", opacity: "0.8" }}>Nouveau mot de passe</p>
              <input
                style={{ width: "510px", height: "40px", fontSize: "16px" }}
                type="password"
                name="newPassword"
                value={formData.newPassword || ""}
                onChange={handleChange}
                disabled={state.status === "submitting"}
              />
            </div>

            <div style={{ margin: "10px 0", width: "510px" }}>
              <p style={{ margin: "0", textAlign: "left", color: "grey", fontSize: "14px", opacity: "0.8" }}>Confirmer le mot de passe</p>
              <input
                style={{ width: "510px", height: "40px", fontSize: "16px" }}
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword || ""}
                onChange={handleChange}
                disabled={state.status === "submitting"}
              />
            </div>

            <div style={{ display: "flex", margin: "10px 0", width: "510px", flexDirection: "row" }}>
              <div>
                <p style={{ margin: "0", textAlign: "left", color: "grey", fontSize: "14px", opacity: "0.8" }}>Prénom*</p>
                <input
                  style={{ width: "230px", height: "40px", fontSize: "16px" }}
                  type="text"
                  name="name"
                  required
                  value={formData.name || ""}
                  onChange={handleChange}
                  disabled={state.status === "submitting"}
                />
              </div>
              <div style={{ padding: "0 48px" }}>
                <p style={{ margin: "0", textAlign: "left", color: "grey", fontSize: "14px", opacity: "0.8" }}>Nom*</p>
                <input
                  style={{ width: "230px", height: "40px", fontSize: "16px" }}
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName || ""}
                  onChange={handleChange}
                  disabled={state.status === "submitting"}
                />
              </div>
            </div>

            <div style={{ margin: "10px 0", width: "510px" }}>
              <p style={{ margin: "0", textAlign: "left", color: "grey", fontSize: "14px", opacity: "0.8" }}>Email*</p>
              <input
                style={{ width: "510px", height: "40px", fontSize: "16px" }}
                type="email"
                name="email"
                required
                value={formData.email || ""}
                onChange={handleChange}
                disabled={state.status === "submitting"}
              />
            </div>

            <button
              type="submit"
              style={{ width: "510px", height: "50px", fontSize: "16px", margin: "15px 0", cursor: "pointer" }}
              disabled={state.status === "submitting"}
            >
              {state.status === "submitting" ? "Modification..." : "Modifier"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}