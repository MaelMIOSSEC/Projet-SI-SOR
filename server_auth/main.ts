import { Application } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import autentificationRouter from "./routes/authentificationRoutes.ts";
import statisticsRouter from "./routes/statisticsRoutes.ts";
import usersRouter from "./routes/usersRoutes.ts";
import boardsRouter from "./routes/boardRoutes.ts";

// ---------- Application --------------------------------

const PROTOCOL = "http";
const HOSTNAME = "localhost";
const PORT = 8000;
const ADDRESS = `${PROTOCOL}://${HOSTNAME}:${PORT}`;

const app = new Application();

app.use(oakCors());
app.use(autentificationRouter.routes());
app.use(autentificationRouter.allowedMethods());

app.use(statisticsRouter.routes());
app.use(statisticsRouter.allowedMethods());

app.use(usersRouter.routes());
app.use(usersRouter.allowedMethods());

app.use(boardsRouter.routes());
app.use(boardsRouter.allowedMethods());

app.addEventListener("listen", () =>
  console.log(`Server listening on ${ADDRESS}`),
);

if (import.meta.main) {
  await app.listen({ hostname: HOSTNAME, port: PORT });
}

export { app };
