import { useState } from "react";
import { API_URL } from "../../config/api.ts";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth.ts";

type RegisterState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; error: string };

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [state, setState] = useState<RegisterState>({ status: "idle" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setState({ status: "submitting" });

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");
    const name = formData.get("name");
    const lastName = formData.get("lastName");
    const email = formData.get("email");

    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, name, lastName, email }),
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
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <div style={{ display: "flex", paddingBottom: "60px" }}>
        <a
          className="btn-link"
          href="/login"
          style={{ border: "1px solid", textDecoration: "none" }}
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
          href="#"
          className="btn-link"
          style={{
            border: "1px solid",
            textDecoration: "none",
            pointerEvents: "none",
            cursor: "default",
            backgroundColor: "#ccc",
          }}
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
          height: "600px",
        }}
      >
        <h1 style={{ textTransform: "uppercase" }}>Création d'un Compte</h1>
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
                placeholder="Enter your Name"
                disabled={state.status === "submitting"}
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
                placeholder="Enter your Lastname"
                disabled={state.status === "submitting"}
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
              placeholder="Enter your Email"
              disabled={state.status === "submitting"}
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
            disabled={state.status === "submitting"}
          >
            {state.status === "submitting" ? "Inscription..." : "S'inscrire"}
          </button>
          {state.status === "error" && (
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
          )}
        </form>
      </div>
    </main>
  );
}
