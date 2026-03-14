import { Router, Context } from "@oak/oak";

const router = new Router();

router.get("/users", async (ctx: Context) => {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Non authentifié" };
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      throw new Error(`Spring a répondu avec un statut ${response.status}`);
    }

    const data = await response.json();

    ctx.response.status = 200;
    ctx.response.body = data;
  } catch (error: any) {
    console.error("Erreur lors de l'appel à Spring : ", error.message);
    ctx.response.status = 502;
    ctx.response.body = {
      success: false,
      message: "Le serveur de données est injoignable",
    };
  }
});

router.get("/boards", async (ctx: Context) => {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Non authentifié" };
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/boards", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      throw new Error(`Spring a répondu avec un statut ${response.status}`);
    }

    const data = await response.json();

    ctx.response.status = 200;
    ctx.response.body = data;
  } catch (error: any) {
    console.error("Erreur lors de l'appel à Spring : ", error.message);
    ctx.response.status = 502;
    ctx.response.body = {
      success: false,
      message: "Le serveur de données est injoignable",
    };
  }
});

router.get("/tasks", async (ctx: Context) => {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Non authentifié" };
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/tasks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      throw new Error(`Spring a répondu avec un statut ${response.status}`);
    }

    const data = await response.json();

    ctx.response.status = 200;
    ctx.response.body = data;
  } catch (error: any) {
    console.error("Erreur lors de l'appel à Spring : ", error.message);
    ctx.response.status = 502;
    ctx.response.body = {
      success: false,
      message: "Le serveur de données est injoignable",
    };
  }
});

export default router;
