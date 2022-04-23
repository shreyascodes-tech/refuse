import { Command } from "https://deno.land/x/cliffy@v0.23.0/command/mod.ts";

import { REFUSE_VERSION } from "./commands/constants.ts";
import { initCommand } from "./commands/init.ts";
import { genCommand } from "./commands/gen.ts";
import { devCommand } from "./commands/dev.ts";
import { startCommand } from "./commands/start.ts";

await new Command()
  .name("Refuse CLI")
  .version(REFUSE_VERSION)
  .description("A CLI tool to work with refuse projects")
  // Init command
  .command("init", "Scaffolds a new Refuse project")
  .arguments("[dir:string]")
  .action(async (_, ...args) => {
    const [dir = "."] = args;
    console.log({ dir });
    await initCommand(dir);
  })
  // Dev command
  .command("dev", "Run the project in development mode")
  .action(devCommand)
  // Start command
  .command("start", "Run the project in production mode")
  .alias("run")
  .alias("serve")
  .alias("server")
  .action(startCommand)
  // Generate command
  .command("generate", genCommand)
  .alias("gen")
  .alias("g")
  .parse(Deno.args);
