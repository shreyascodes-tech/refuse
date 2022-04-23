import { REFUSE_URL } from "./constants.ts";

const dirEr = (base: string) => (path: string) => base + "/" + path;

export const initCommand = async (dir: string) => {
  console.log("✨ Scaffolding the project...");

  await Deno.mkdir(dir);

  const d = dirEr(dir);
  console.info("📝 Writing refuse.ts");
  await Deno.writeTextFile(d("refuse.ts"), `export * from "${REFUSE_URL}";`);
  console.info("📝 Writing main.ts");
  await Deno.writeTextFile(
    d("main.ts"),
    `import { runApp } from "./refuse.ts";
import { routes } from "./router.ts";

const dev = Deno.args[0] === "dev";

await runApp({
  port: dev ? 3000 : 80,
  routes,
  dev,
});
`
  );
  console.info("📁 Creating Routes directory");
  await Deno.mkdir(d("routes"));
  console.info("📝 Creating root layout");
  await Deno.writeTextFile(
    d("routes/layout.tsx"),
    `/**@jsx h */
import { h, RC } from "../refuse.ts";

interface LayoutProps {}

const Layout: RC<LayoutProps> = ({ children }) => {
  return (
    <html>
      <head>
        <title>Refuse</title>
      </head>
      <body>{children}</body>
    </html>
  );
};
export default Layout;
`
  );
  console.info("📝 Creating index route");
  await Deno.writeTextFile(
    d("routes/index.tsx"),
    `/**@jsx h */
import { h, RC } from "../refuse.ts";
  
interface IndexProps {}

const Index: RC<IndexProps> = () => {
    return (
      <main>
        <h1>Home Page</h1>
      </main> 
    );
}
export default Index;
`
  );
  console.info("✅ Init successful\n");
  console.info("Run the following commands to start the dev server");
  console.info("\tcd " + dir);
  console.info("\trfc dev");
};
