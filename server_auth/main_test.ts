import { assert } from "@std/assert";
import { app } from "./main.ts";

Deno.test(function addTest() {
  assert(app);
});
