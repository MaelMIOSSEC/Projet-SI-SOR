import { Context, Router } from "@oak/oak";

const router = new Router();

router.post("/tasks", async (ctx: Context) => {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Non authentifié" };
    return;
  }

  try {
    const body = ctx.request.body;
    const taskData = await body.json();

    const response = await fetch(`http://localhost:8080/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`Spring a répondu avec un statut ${response.status}`);
    }

    const data = await response.json();

    ctx.response.status = 200;
    ctx.response.body = data;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";

    console.error("Erreur lors de l'appel à Spring : ", errorMessage);

    ctx.response.status = 502;
    ctx.response.body = {
      success: false,
      message: "Le serveur de données est injoignable ou erreur interne",
      error: errorMessage,
    };
  }
});

export default router;
