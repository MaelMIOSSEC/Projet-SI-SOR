export default function Login() {
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
            <a href="#" style={{ border: "1px solid", textDecoration: "none", pointerEvents: "none", cursor: "default", backgroundColor: "#ccc"}}>Connexion</a>
            <div style={{ width: "1px", height: "50px", backgroundColor: "black", margin: "0 20px" }}></div>
            <a href="/register" style={{ border: "1px solid", textDecoration: "none"  }}>Inscription</a>
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
        <div
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
              style={{ width: "480px", height: "40px", fontSize: "16px" }}
              type="text"
              id="username"
              required
              placeholder="Enter your Username"
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
              style={{ width: "480px", height: "40px", fontSize: "16px" }}
              type="password"
              id="password"
              required
              placeholder="Enter your Password"
            />
          </div>
          <button
            style={{
              width: "510px",
              height: "50px",
              fontSize: "16px",
              margin: "15px 0",
            }}
          >
            Connexion
          </button>
        </div>
      </div>
    </main>
  );
}
