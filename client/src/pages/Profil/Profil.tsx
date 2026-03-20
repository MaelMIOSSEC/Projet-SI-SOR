import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth.ts";
import { API_URL } from "../../config/api.ts";
import Sidebar from "../../components/Sidebar.tsx";
import type { User } from "../../types/userType.ts";
import { ErrorHandling } from "../../utility/ErrorHandling.ts";
import { AlertDismissible } from "../../components/AlertDismissible.tsx";
import "../../index.css";
import { useNavigate } from "react-router-dom";

type ProfilState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; error: string };

interface UserFormData extends Partial<User> {
  newPassword?: string;
  confirmPassword?: string;
}

export default function Profil() {
  const { user, setUser, authFetch } = useAuth();
  const navigate = useNavigate();

  const [state, setState] = useState<ProfilState>({ status: "idle" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<UserFormData>(
    user ? { ...user, newPassword: "", confirmPassword: "" } : {},
  );

  if (user === null) navigate("/");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setState({ status: "submitting" });

    const payload: any = {
      username: formData.username || user?.username,
      name: formData.name || user?.name,
      lastName: formData.lastName || user?.lastName,
      email: formData.email || user?.email,
      isAdmin: formData.isAdmin ? 1 : 0,
      createdAt: formData.createdAt || user?.createdAt,
    };

    if (formData.newPassword && formData.newPassword.trim() !== "") {
      if (formData.newPassword !== formData.confirmPassword) {
        setErrorMessage("Les nouveaux mots de passe ne correspondent pas.");
        setState({ status: "idle" });
        return;
      }
      payload.password = formData.newPassword;
    }

    try {
      const response = await authFetch(`${API_URL}/users/${user?.userId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new ErrorHandling(response.status, `Erreur ${response.status}`);
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

      setSuccessMessage("Profil mis à jour avec succès !");
      setFormData((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
      setState({ status: "idle" });

      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error("Échec update profil:", err);
      setState({ status: "idle" });

      if (err instanceof ErrorHandling) {
        switch (err.status) {
          case 401:
            setErrorMessage("Session expirée. Veuillez vous reconnecter.");
            break;
          case 403:
            setErrorMessage("Vous n'êtes pas autorisé à modifier ce profil.");
            break;
          case 500:
            setErrorMessage("Erreur serveur lors de la mise à jour.");
            break;
          default:
            setErrorMessage(`Une erreur est survenue (Code: ${err.status})`);
        }
      } else {
        setErrorMessage("Une erreur réseau ou inconnue est survenue.");
      }
    }
  };

  useEffect(() => {
    if (user === null) navigate("/");
  }, [navigate, user]);

  return (
    <main className="profil-page-container">
      {errorMessage && (
        <div className="error-alert-container">
          <AlertDismissible message={errorMessage} />
        </div>
      )}

      <Sidebar />

      <div className="profil-content">
        <div className="profil-header">
          <h1>Bonjour, {user?.name}</h1>
        </div>

        <div className="profil-card">
          <form onSubmit={handleUpdate} className="profil-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username*
              </label>
              <input
                id="username"
                className="form-input"
                type="text"
                name="username"
                required
                value={formData.username || ""}
                onChange={handleChange}
                disabled={state.status === "submitting"}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                Nouveau mot de passe
              </label>
              <input
                id="newPassword"
                className="form-input"
                type="password"
                name="newPassword"
                value={formData.newPassword || ""}
                onChange={handleChange}
                disabled={state.status === "submitting"}
                placeholder="Laissez vide pour ne pas modifier"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                className="form-input"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword || ""}
                onChange={handleChange}
                disabled={state.status === "submitting"}
                placeholder="Confirmez votre nouveau mot de passe"
              />
            </div>

            <div className="form-row">
              <div className="form-col">
                <label htmlFor="name" className="form-label">
                  Prénom*
                </label>
                <input
                  id="name"
                  className="form-input"
                  type="text"
                  name="name"
                  required
                  value={formData.name || ""}
                  onChange={handleChange}
                  disabled={state.status === "submitting"}
                />
              </div>
              <div className="form-col">
                <label htmlFor="lastName" className="form-label">
                  Nom*
                </label>
                <input
                  id="lastName"
                  className="form-input"
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName || ""}
                  onChange={handleChange}
                  disabled={state.status === "submitting"}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email*
              </label>
              <input
                id="email"
                className="form-input"
                type="email"
                name="email"
                required
                value={formData.email || ""}
                onChange={handleChange}
                disabled={state.status === "submitting"}
              />
            </div>

            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}

            <button
              type="submit"
              className="btn-submit"
              disabled={state.status === "submitting"}
            >
              {state.status === "submitting"
                ? "Modification..."
                : "Modifier le profil"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
