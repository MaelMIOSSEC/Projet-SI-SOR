import { useState } from "react";
import { URL_DENO } from "../config/api";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

type LoginState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; error: string };

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [state, setState] = useState<LoginState>({ status: "idle" });

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setState({ status: "submitting" });

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await fetch(`${URL_DENO}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const apiResponse = await res.json();

      if (apiResponse.success) {
        login(apiResponse.data);
        navigate("/");
      } else {
        setState({
          status: "error",
          error: apiResponse.error.message,
        });
      }
    } catch (err) {
      setState({
        status: "error",
        error: err instanceof Error ? err.message : "Login failed.",
      });
    }
  }

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <div style={{ display: "flex", paddingBottom: "60px" }}>
        <a
          className="btn-link"
          href="#"
          style={{
            border: "1px solid",
            textDecoration: "none",
            pointerEvents: "none",
            cursor: "default",
            backgroundColor: "#ccc",
          }}
        >
          Connexion
        </a>
        <div
          style={{
            width: "1px",
            height: "50px",
            backgroundColor: "black",
            margin: "0 20px",
          }}
        ></div>
        <a
          className="btn-link"
          href="/register"
          style={{ border: "1px solid", textDecoration: "none" }}
        >
          Inscription
        </a>
      </div>
      <div
        style={{
          borderRadius: "30px",
          padding: "40px 0 0 0",
          backgroundColor: "white",
          width: "650px",
          height: "450px",
        }}
      >
        <h1 style={{ textTransform: "uppercase" }}>Connexion au compte</h1>
        <form
          onSubmit={handleSubmit}
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
              placeholder="Enter your Username"
              disabled={state.status === "submitting"}
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
              placeholder="Enter your Password"
              disabled={state.status === "submitting"}
            />
          </div>
          <button
            disabled={state.status === "submitting"}
            style={{
              width: "510px",
              height: "50px",
              fontSize: "16px",
              margin: "15px 0",
            }}
          >
            {state.status === "submitting" ? "Connexion..." : "Se connecter"}
          </button>
          {state.status === "error" ? (
            <p
              style={{
                border: "1px solid",
                padding: "10px",
                borderRadius: "15px",
                backgroundColor: "red",
                color: "white",
                opacity: "50%",
              }}
            >
              Une erreur s'est produite à l'enregistrement du formulaire...
            </p>
          ) : (
            <></>
          )}
        </form>
      </div>
    </main>
  );
}
