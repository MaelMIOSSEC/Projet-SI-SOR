import { Router, Context } from "@oak/oak";
import { hashPassword } from "../lib/jwt.ts";

const router = new Router({ prefix: "/users" });

/**Route for fetching user information. It checks for a valid JWT token in the Authorization header before making a request to the Spring backend to retrieve the user information. */
router.get("/", async (ctx: Context) => {
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

/**Route for fetching the boards associated with a specific user. It checks for a valid JWT token in the Authorization header before making a request to the Spring backend to retrieve the boards information. */
router.get("/:userId/boards", async (ctx: Context) => {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Non authentifié" };
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/users/${ctx.params.userId}/boards`, {
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
}) 

/**Route for updating user information. It checks for a valid JWT token in the Authorization header before making a request to the Spring backend to update the user information. The password is hashed before being sent to the backend. */
router.put("/:userId", async (ctx: Context) => {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Non authentifié" };
    return;
  }

  try {
    const body = ctx.request.body;
    const userData = await body.json();

    userData.password = await hashPassword(userData.password);

    const response = await fetch(
      `http://localhost:8080/users/${ctx.params.userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(userData),
      },
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

/**Route for deleting a user. It checks for a valid JWT token in the Authorization header before making a request to the Spring backend to delete the user. */
router.delete("/:userId", async (ctx: Context) => {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Non authentifié" };
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/users/${ctx.params.userId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      },
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

/**Route for fetching the invitations associated with a specific user. It checks for a valid JWT token in the Authorization header before making a request to the Spring backend to retrieve the invitations information. */
router.get("/:userId/invitation", async (ctx: Context) => {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Non authentifié" };
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/users/${ctx.params.userId}/invitation`, {
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

/**Route for accepting or declining an invitation. It checks for a valid JWT token in the Authorization header before making a request to the Spring backend to accept or decline the invitation. */
router.delete("/:userId/invitation/:boardId", async (ctx: Context) => {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Non authentifié" };
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/users/${ctx.params.userId}/invitation/${ctx.params.boardId}`, {
      method: "DELETE",
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

/**Route for accepting or declining an invitation. It checks for a valid JWT token in the Authorization header before making a request to the Spring backend to accept or decline the invitation. */
router.put("/:userId/invitation/:boardId", async (ctx: Context) => {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Non authentifié" };
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/users/${ctx.params.userId}/invitation/${ctx.params.boardId}`, {
      method: "PUT",
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
