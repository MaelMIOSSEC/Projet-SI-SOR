import { Application } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import autentificationRouter from "./routes/authentificationRoutes.ts";

// ---------- Application --------------------------------

const PROTOCOL = "http";
const HOSTNAME = "localhost";
const PORT = 8000;
const ADDRESS = `${PROTOCOL}://${HOSTNAME}:${PORT}`;

const app = new Application();

app.use(oakCors());
app.use(autentificationRouter.routes());
app.use(autentificationRouter.allowedMethods());

app.addEventListener("listen", () =>
  console.log(`Server listening on ${ADDRESS}`)
);

if (import.meta.main) {
  await app.listen({ hostname: HOSTNAME, port: PORT });
}

export { app };