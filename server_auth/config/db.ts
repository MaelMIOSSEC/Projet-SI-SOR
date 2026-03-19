import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";

/* Establishes a connection to the MySQL database using the Client from the mysql module.
 * The connection parameters (hostname, port, username, password, and database name) are retrieved from environment variables.
 * If the environment variables are not set, default values are used.
 * The connection object is exported as the default export of this module for use in other parts of the application.
 */
const connection = await new Client().connect({
  hostname: Deno.env.get("MYSQL_HOST") || "obiwan.univ-brest.fr",
  port: Number(Deno.env.get("MYSQL_PORT") || "3306"),
  username: Deno.env.get("MYSQL_USER") || "e22206673sql",
  password: Deno.env.get("MYSQL_PASSWORD") || "rDoKnVI6",
  db: Deno.env.get("MYSQL_DATABASE") || "e22206673_db1",
});

export default connection;