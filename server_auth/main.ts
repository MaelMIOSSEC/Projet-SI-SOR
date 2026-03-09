import { Application } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";

// ---------- Application --------------------------------

const PROTOCOL = "http";
const HOSTNAME = "localhost";
const PORT = 8000;
const ADDRESS = `${PROTOCOL}://${HOSTNAME}:${PORT}`;

const app = new Application();

app.use(oakCors());

app.addEventListener("listen", () =>
  console.log(`Server listening on ${ADDRESS}`)
);

if (import.meta.main) {
  await app.listen({ hostname: HOSTNAME, port: PORT });
}

export { app };