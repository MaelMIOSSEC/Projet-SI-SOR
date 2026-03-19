import { Context, Router, type RouterContext } from "@oak/oak";
import { Board } from "../types/boardType.ts";
import { ApiErrorCode } from "../types/exceptionType.ts";

const router = new Router();

/** Router for handling board-related routes. It includes routes for getting a board, creating a board for a user, updating a board, deleting a board, managing users on a board, and managing columns on a board. Each route checks for the presence of a valid JWT token in the Authorization header before making requests to the Spring backend. */
router.get(
  "/boards/:boardId",
  async (ctx: RouterContext<"/boards/:boardId">) => {
    const authHeader = ctx.request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Non authentifié" };
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/boards/${ctx.params.boardId}`,
        {
          method: "GET",
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
  },
);

/** Route for creating a new board for a user. It checks for a valid JWT token in the Authorization header, and then sends a POST request to the Spring backend to create the board. The board data is expected to be in the request body as JSON. */
router.post(
  "/users/:userId/boards",
  async (ctx: RouterContext<"/users/:userId/boards">) => {
    const authHeader = ctx.request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Non authentifié" };
      return;
    }

    try {
      const body = ctx.request.body;
      const boardData = await body.json();

      if (boardData.title === "" || boardData.title.length > 100) {
        const response: ApiResponse<Board> = {
          success: false,
          error: {
            code: ApiErrorCode.BAD_REQUEST,
            message: "Missing information...",
          },
        };

        ctx.response.status = 400;
        ctx.response.body = response;

        return;
      }

      const response = await fetch(
        `http://localhost:8080/users/${ctx.params.userId}/boards`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify(boardData),
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
  },
);

/** Route for updating a board. It checks for a valid JWT token in the Authorization header, and then sends a PUT request to the Spring backend to update the board. The updated board data is expected to be in the request body as JSON. */
router.put(
  "/boards/:boardId",
  async (ctx: RouterContext<"/boards/:boardId">) => {
    const authHeader = ctx.request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Non authentifié" };
      return;
    }

    try {
      const body = ctx.request.body;
      const boardData = await body.json();

      const response = await fetch(
        `http://localhost:8080/boards/${ctx.params.boardId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify(boardData),
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
  },
);

/** Route for deleting a board. It checks for a valid JWT token in the Authorization header, and then sends a DELETE request to the Spring backend to delete the board. */
router.delete(
  "/boards/:boardId",
  async (ctx: RouterContext<"/boards/:boardId">) => {
    const authHeader = ctx.request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Non authentifié" };
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/boards/${ctx.params.boardId}`,
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
  },
);

/** Route for removing a user from a board. It checks for a valid JWT token in the Authorization header, and then sends a DELETE request to the Spring backend to remove the user from the board. */
router.delete(
  "/boards/:boardId/users/:userId",
  async (ctx: RouterContext<"/boards/:boardId/users/:userId">) => {
    const authHeader = ctx.request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Non authentifié" };
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/boards/${ctx.params.boardId}/users/${ctx.params.userId}`,
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
  },
);

/** Route for removing a column from a board. It checks for a valid JWT token in the Authorization header, and then sends a DELETE request to the Spring backend to remove the column from the board. */
router.delete(
  "/boards/:boardId/columns/:columnId",
  async (ctx: RouterContext<"/boards/:boardId/columns/:columnId">) => {
    const authHeader = ctx.request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Non authentifié" };
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/boards/${ctx.params.boardId}/columns/${ctx.params.columnId}`,
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
  },
);

/** Route for adding a user to a board. It checks for a valid JWT token in the Authorization header, and then sends a POST request to the Spring backend to add the user to the board. The user data is expected to be in the request body as JSON. */
router.post(
  "/boards/:boardId/users",
  async (ctx: RouterContext<"/boards/:boardId/users">) => {
    const authHeader = ctx.request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Non authentifié" };
      return;
    }

    try {
      const body = ctx.request.body;
      const userData = await body.json();

      const response = await fetch(
        `http://localhost:8080/boards/${ctx.params.boardId}/users`,
        {
          method: "POST",
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
  },
);

export default router;
