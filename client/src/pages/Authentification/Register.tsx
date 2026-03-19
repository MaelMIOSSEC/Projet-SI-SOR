import { useState } from "react";
import { API_URL } from "../../config/api.ts";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.ts";
import { ErrorHandling } from "../../utility/ErrorHandling.ts";
import { AlertDismissible } from "../../components/AlertDismissible.tsx";
import "../../index.css";

type RegisterState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; error: string };

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [state, setState] = useState<RegisterState>({ status: "idle" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setState({ status: "submitting" });

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");
    const name = formData.get("name");
    const lastName = formData.get("lastName");
    const email = formData.get("email");

    if (!username || !password || !name || !lastName || !email) {
      setState({ status: "error", error: "Veuillez remplir tous les champs." });
      return;
    } else if ((password as string).length < 8) {
      setState({
        status: "error",
        error: "Le mot de passe doit contenir au moins 8 caractères.",
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, name, lastName, email }),
      });

      if (!response.ok) {
        throw new ErrorHandling(response.status, `Erreur ${response.status}`);
      }

      const apiResponse = await response.json();

      if (apiResponse.success) {
        login(apiResponse.data);
        navigate("/");
      } else {
        setState({
          status: "error",
          error: apiResponse.error?.message ?? "Erreur inconnue.",
        });
      }
    } catch (err) {
      console.error("Échec handleSubmit:", err);
      setState({ status: "idle" });

      if (err instanceof ErrorHandling) {
        switch (err.status) {
          case 401:
            setErrorMessage(
              "Certaines informations sont incorrectes. Veuillez réessayer.",
            );
            break;
          case 409:
            setErrorMessage(
              "Cette adresse email ou ce nom d'utilisateur sont déjà utilisés. Veuillez les modifier.",
            );
            break;
          case 451:
            setErrorMessage(
              "L'adresse email fournie n'est pas valide. Veuillez en fournir une autre.",
            );
            break;
          case 500:
            setErrorMessage(
              "Le serveur rencontre un problème. Réessayez plus tard.",
            );
            break;
          default:
            setErrorMessage(`Une erreur est survenue (Code: ${err.status})`);
        }
      } else {
        setErrorMessage("Une erreur réseau ou inconnue est survenue.");
      }
    }
  };

  return (
    <main className="login-container">
      {errorMessage && (
        <div className="error-alert-container">
          <AlertDismissible message={errorMessage} />
        </div>
      )}

      <div className="auth-tabs">
        <Link to="/login" className="auth-tab-link">
          Connexion
        </Link>
        <div className="auth-tab-divider"></div>
        <span className="auth-tab-link active" aria-current="page">
          Inscription
        </span>
      </div>

      <div className="login-card">
        <h1 className="login-title">Création d'un Compte</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Pseudo*
            </label>
            <input
              className="form-input"
              type="text"
              name="username"
              id="username"
              required
              placeholder="Entrez votre pseudo"
              disabled={state.status === "submitting"}
            />
          </div>

          <div className="form-row">
            <div className="form-col">
              <label htmlFor="name" className="form-label">
                Prénom*
              </label>
              <input
                className="form-input"
                type="text"
                name="name"
                id="name"
                required
                placeholder="Entrez votre prénom"
                disabled={state.status === "submitting"}
              />
            </div>

            <div className="form-col">
              <label htmlFor="lastname" className="form-label">
                Nom de famille*
              </label>
              <input
                className="form-input"
                type="text"
                name="lastName"
                id="lastname"
                required
                placeholder="Entrez votre nom"
                disabled={state.status === "submitting"}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email*
            </label>
            <input
              className="form-input"
              type="email"
              name="email"
              id="email"
              required
              placeholder="Entrez votre email"
              disabled={state.status === "submitting"}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mot de passe*
            </label>
            <input
              className="form-input"
              type="password"
              name="password"
              id="password"
              required
              placeholder="Entrez votre mot de passe (8 car. min)"
              disabled={state.status === "submitting"}
            />
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={state.status === "submitting"}
          >
            {state.status === "submitting" ? "Inscription..." : "S'inscrire"}
          </button>

          {state.status === "error" && (
            <p className="error-message">{state.error}</p>
          )}
        </form>
      </div>
    </main>
  );
}
