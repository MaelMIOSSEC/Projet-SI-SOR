import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";

const connection = await new Client().connect({
  hostname: Deno.env.get("MYSQL_HOST") || "obiwan.univ-brest.fr",
  port: Number(Deno.env.get("MYSQL_PORT") || "3306"),
  username: Deno.env.get("MYSQL_USER") || "e22206673sql",
  password: Deno.env.get("MYSQL_PASSWORD") || "rDoKnVI6",
  db: Deno.env.get("MYSQL_DATABASE") || "e22206673_db1",
});

export default connection;