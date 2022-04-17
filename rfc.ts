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
  console.info("Writing deno.json");
  await Deno.writeTextFile(
    "deno.json",
    `{
      "importMap": "import_map.json",
      "compilerOptions": {
        "jsxFactory": "h"
      }
    }
    `
  );
  console.info("Writing import_map.json");
  await Deno.writeTextFile(
    "import_map.json",
    `{
      "imports": {
        "react": "https://esm.sh/react",
        "refuse": "https://raw.githubusercontent.com/shreyassanthu77/refuse/main/refuse.ts"
      }
    }`
  );
  console.info("Writing main.ts");
  await Deno.writeTextFile(
    "main.ts",
    `import { runApp } from "refuse";
    import { routes } from "./router.ts";
    
    const dev = Deno.args[0] === "dev";
    
    await runApp({
      port: dev ? 3000 : 80,
      routes,
      dev,
    });
    `
  );
  console.info("Creating Routes directory");
  await Deno.mkdir("routes");
  console.info("Creating root layout");
  await Deno.writeTextFile(
    "routes/layout.tsx",
    `import { h } from "refuse";

    const Layout: React.FC = ({ children }) => {
      return (
        <html>
          <head>
            <title>Refuse</title>
          </head>
          <body>{children}</body>
        </html>
      );
    };
    //
    export default Layout;
    `
  );
  console.info("Creating index route");
  await Deno.writeTextFile(
    "routes/index.tsx",
    `import { h } from "refuse";
    
    export default function Index() {
      return (
        <main>
        <h1>Home Page</h1>
        </main>
        );
      }
      `
  );
  console.info("Generating router.ts");
  console.info("Init successful\n\n\n");
  console.info("Run `rfc dev` to start the dev server");
  await generateRouteMap();
}
