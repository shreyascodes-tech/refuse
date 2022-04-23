import { generateRouter } from "./gen-router.ts";

export const startCommand = async () => {
  console.log("Generating Router");
  await Deno.writeTextFile("router.ts", await generateRouter());
  console.log("Written to router.ts");
  console.log("Launching server");
  Deno.run({
    cmd: ["deno", "run", "--allow-net", "--allow-read", "main.ts"],
    stdin: "inherit",
    stderr: "inherit",
    stdout: "inherit",
  });
  while (true);
};
