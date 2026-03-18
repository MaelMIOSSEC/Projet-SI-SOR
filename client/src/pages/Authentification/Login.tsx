import { useState } from "react";
import { API_URL } from "../../config/api.ts";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.ts";
import { ErrorHandling } from "../../utility/ErrorHandling.ts";
import AlertDismissible from "../../components/AlertDismissible.tsx";
import "../../index.css";

type LoginState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; error: string };

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [state, setState] = useState<LoginState>({ status: "idle" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setState({ status: "submitting" });

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    if (!username || !password) {
      setState({ status: "error", error: "Veuillez remplir tous les champs." });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
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
              "Les identifiants saisis sont incorrects. Veuillez réessayer.",
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
        <span className="auth-tab-link active" aria-current="page">
          Connexion
        </span>
        <div className="auth-tab-divider"></div>
        <Link to="/register" className="auth-tab-link">
          Inscription
        </Link>
      </div>

      <div className="login-card">
        <h1 className="login-title">Connexion au compte</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username*
            </label>
            <input
              className="form-input"
              type="text"
              name="username"
              id="username"
              required
              aria-required="true"
              placeholder="Entrez votre pseudo"
              disabled={state.status === "submitting"}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password*
            </label>
            <input
              className="form-input"
              type="password"
              name="password"
              id="password"
              required
              aria-required="true"
              placeholder="Entrez votre mot de passe"
              disabled={state.status === "submitting"}
            />
          </div>

          <button
            type="submit"
            disabled={state.status === "submitting"}
            className="btn-submit"
          >
            {state.status === "submitting" ? "Connexion..." : "Se connecter"}
          </button>

          {state.status === "error" && (
            <p className="error-message">{state.error}</p>
          )}
        </form>
      </div>
    </main>
  );
}
