import { Command } from "https://deno.land/x/cliffy@v0.23.0/command/mod.ts";
import { REFUSE_VERSION } from "./constants.ts";
import { generateRouter } from "./gen-router.ts";
import { exists } from "https://deno.land/std@0.135.0/fs/mod.ts";

export const genCommand = new Command()
  .name("generate")
  .version(REFUSE_VERSION)
  .description("Generates a feature")
  .command("router", "Generates the router.ts file with all the route modules")
  .alias("rr")
  .action(async () => {
    if (!(await exists("routes"))) {
      console.log("❌ Please run the command from a refuse project root");
      return;
    }
    console.info("🚢 Generating router.ts");
    const routerFile = await generateRouter();
    await Deno.writeTextFile("router.ts", routerFile);
    console.info("✅ Router generation successful\n");
  });
