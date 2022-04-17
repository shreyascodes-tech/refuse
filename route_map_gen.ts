import { expandGlob, exists } from "https://deno.land/std@0.135.0/fs/mod.ts";

export async function generateRouteMap() {
  const cwd = Deno.cwd();
  const config = (await exists("refuse.json"))
    ? JSON.parse(await Deno.readTextFile("refuse.json"))
    : {
        routesDir: "routes",
      };

  const routes: {
    name: string;
    path: string;
    posixPath: string;
    ext: string;
    route: string;
    dir: string;
    modName: string;
  }[] = [];

  for await (const file of expandGlob(
    `./${config.routesDir ?? "routes"}/**/*.{tsx,ts,jsx,js}`
  )) {
    const name = file.name;
    const posixPath = file.path.replace(cwd, "").replaceAll("\\", "/").slice(1);
    const path = file.path;
    const ext = file.name.split(".").pop()!;
    const route = posixPath
      .replace(config.routesDir ?? "routes", "")
      .replace("." + ext, "")
      .replaceAll("$", ":")
      .replaceAll("index", "");
    const dir = posixPath.replaceAll("/" + name, "");

    routes.push({
      name,
      path,
      posixPath,
      ext,
      route,
      dir,
      modName: route.slice(1).split("/").join("_") + "_" + ext,
    });
  }

  const imports = routes
    .map(({ modName, posixPath }) => {
      return `import * as ${modName} from "./${posixPath}";`;
    })
    .join("\n");
  const routerFile = `${imports}
export const routes = [
  ${routes
    .map(
      (route) => `{
    ${Object.entries(route)
      .map(([key, value]) => `${key}: "${value}",`)
      .join("\n    ")}
    mod: ${route.modName}
  }`
    )
    .join(",\n  ")},
];
`;
  await Deno.writeTextFile("router.ts", routerFile);
}

generateRouteMap();
