import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { generateRouteMap } from "./route_map_gen.ts";

export async function devServer() {
  console.log("Starting Auto-Reload Client...");

  const wss = new WebSocketServer(5555);

  const listeners: WebSocketClient[] = [];
  wss.on("connection", function (ws: WebSocketClient) {
    listeners.push(ws);
    ws.on("close", () => {
      listeners.filter((c) => c !== ws);
    });
  });

  async function initServer() {
    console.log("Generating Route Map");
    await generateRouteMap();

    return Deno.run({
      cmd: [
        "deno",
        "run",
        "-A",
        "--no-check",
        "-c",
        "deno.json",
        "main.ts",
        "dev",
      ],
      stdin: "inherit",
      stderr: "inherit",
      stdout: "inherit",
    });
  }

  function restartServer(server: Deno.Process) {
    console.log("Restarting The server...");
    server.kill("SIGKILL");
    server.close();
    return initServer();
  }

  let server = await initServer();
  for await (const ev of Deno.watchFs(".")) {
    const cwd = Deno.cwd();
    const routerFile = ev.paths
      .find((p) => p.endsWith("router.ts"))
      ?.replaceAll(cwd, "")
      .replaceAll("\\", "/");

    if (
      routerFile === "/./router.ts" &&
      (ev.kind === "modify" || ev.kind === "create")
    ) {
      continue;
    }

    server = await restartServer(server);
    listeners.forEach((listener) => listener.send("reload"));
  }
}
