import { Router, Context, type RouterContext } from "@oak/oak";

const router = new Router();
/** Route for handling kanban column-related routes. It includes a route for creating a new column. The route checks for the presence of a valid JWT token in the Authorization header before making a request to the Spring backend to create the column. */
router.post("/columns", async (ctx: RouterContext<"/columns">) => {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Non authentifié" };
    return;
  }

  try {
    const body = ctx.request.body;
    const taskData = await body.json();

    const response = await fetch(`http://localhost:8080/columns`, {
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

/** Route for fetching tasks associated with a specific kanban column. It checks for a valid JWT token in the Authorization header before making a request to the Spring backend to retrieve the tasks for the specified column. */
router.get(`/columns/:columnId/tasks`, async (ctx: RouterContext<"/columns/:columnId/tasks">) => {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Non authentifié" };
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/columns/${ctx.params.columnId}/tasks`,
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
