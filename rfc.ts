import { generateRouteMap } from "./route_map_gen.ts";
import { devServer } from "./dev.ts";

const args = Deno.args;
if (args[0] === "gen") {
  const toGen = args[1];

  if (toGen === "router") {
    console.log("Generating router");
    await generateRouteMap();
    console.log("Written to router.ts");
  }
} else if (args[0] === "dev") {
  console.log("Launching dev server");
  await devServer();
} else if (args[0] === "start") {
  console.log("Generating router");
  await generateRouteMap();
  console.log("Written to router.ts");
  console.log("Launching server");
  Deno.run({
    cmd: ["deno", "run", "--allow-net", "--allow-read", "main.ts"],
    stdin: "inherit",
    stderr: "inherit",
    stdout: "inherit",
  });
  while (true);
} else if (args[0] === "init") {
  console.log("Scaffolding the app");
}
