import { Context, Router, type RouterContext } from "@oak/oak";

const router = new Router();

/** Router for handling comment-related routes. It includes a route for getting comments for a specific task. The route checks for the presence of a valid JWT token in the Authorization header before making a request to the Spring backend to retrieve the comments. */
router.get("/comments/tasks/:taskId", async (ctx: RouterContext<"/comments/tasks/:taskId">) => {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Non authentifié" };
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/comments/tasks/${ctx.params.taskId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );

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

/** Route pour ajouter un commentaire */
router.post("/comments/tasks/:taskId", async (ctx: RouterContext<"/comments/tasks/:taskId">) => {
  const authHeader = ctx.request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401; return;
  }
  try {
    const body = ctx.request.body;
    const commentData = await body.json();
    const response = await fetch(`http://localhost:8080/comments/tasks/${ctx.params.taskId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify(commentData),
    });
    if (!response.ok) throw new Error(`Statut ${response.status}`);
    ctx.response.status = 200;
    ctx.response.body = await response.json();
  } catch (error: any) {
    ctx.response.status = 502;
    ctx.response.body = { error: error.message };
  }
});

/** Route pour supprimer un commentaire */
router.delete("/comments/:commentId", async (ctx: RouterContext<"/comments/:commentId">) => {
  const authHeader = ctx.request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401; return;
  }
  try {
    const response = await fetch(`http://localhost:8080/comments/${ctx.params.commentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
    });
    if (!response.ok) throw new Error(`Statut ${response.status}`);
    ctx.response.status = 200;
    ctx.response.body = await response.json();
  } catch (error: any) {
    ctx.response.status = 502;
    ctx.response.body = { error: error.message };
  }
});

export default router;