// deno-lint-ignore-file no-explicit-any
// import { routes } from "../router.ts";

import {
  Application,
  Router,
  Context,
} from "https://deno.land/x/oak@v10.5.1/mod.ts";
import DefaultLayout from "./DefaultLayout.tsx";
import { RC, Request, Response } from "./refuse.ts";
import { renderView, composeLayout } from "./renderer.tsx";

const req = (ctx: Context) => {
  const r = ctx.request;
  const reqObj: any = {};
  reqObj.accepts = r.accepts;
  reqObj.acceptsEncodings = r.acceptsEncodings;
  reqObj.acceptsLanguages = r.acceptsLanguages;
  reqObj.body = r.body;
  reqObj.hasBody = r.hasBody;
  reqObj.headers = r.headers;
  reqObj.ip = r.ip;
  reqObj.ips = r.ips;
  reqObj.method = r.method;
  reqObj.originalRequest = r.originalRequest;
  reqObj.secure = r.secure;
  reqObj.url = r.url;
  reqObj.dev = ctx.state.dev;
  // @ts-ignore I know it works
  reqObj.params = ctx.params;

  return reqObj as Request;
};

const respond = async (ctx: Context, fn: (req: Request) => Response) => {
  const {
    status = 200,
    body = "",
    headers = [],
    redirect,
  } = (await fn(req(ctx))) as any;

  if (redirect && typeof redirect === "string")
    return ctx.response.redirect(redirect);
  headers.forEach(([name, value]: any) =>
    ctx.response.headers.set(name, value)
  );
  ctx.response.status = status;
  ctx.response.body = body;
};

function createApp(
  dev: boolean,
  routes: {
    name: string;
    path: string;
    posixPath: string;
    ext: string;
    route: string;
    dir: string;
    modName: string;
    mod: any;
  }[]
) {
  const app = new Application();

  const router = new Router();

  app.use((ctx, next) => {
    ctx.state.dev = dev;
    return next();
  });

  const layouts = routes.filter(
    (r) => r.name === "layout.tsx" || r.name === "layout.jsx"
  )!;

  routes.forEach(({ ext, mod, name, route, dir }) => {
    if (
      name === "layout.tsx" ||
      name === "layout.jsx" ||
      name.startsWith("_")
    ) {
      return;
    }

    let View: RC | undefined = undefined,
      ViewLayout: RC = DefaultLayout;
    if (ext === "jsx" || ext === "tsx") {
      View = (mod as any).default as RC<any>;

      ViewLayout =
        (layouts.find((layout) => layout.dir === dir)?.mod as any).default ??
        DefaultLayout;
    }
    const { get, post, put, patch, del, head, options } = mod as any;

    if (!View && !get) {
      // do Nothing
    } else if (!View && get) {
      router.get(route, (ctx) => respond(ctx, get));
    } else if (View && typeof View === "function" && !get) {
      router.get(route, (ctx) =>
        respond(ctx, (req) => ({
          status: 200,
          body: renderView(composeLayout(req, ViewLayout, View!)),
          headers: [["Content-Type", "text/html"]],
        }))
      );
    }
    post && router.post(route, (ctx) => respond(ctx, post));
    put && router.put(route, (ctx) => respond(ctx, put));
    patch && router.patch(route, (ctx) => respond(ctx, patch));
    del && router.delete(route, (ctx) => respond(ctx, del));
    head && router.head(route, (ctx) => respond(ctx, head));
    options && router.options(route, (ctx) => respond(ctx, options));
  });

  app.use(router.routes()).use(router.allowedMethods());

  return app;
}

export async function runApp({
  dev = false,
  port = 80,
  routes = [],
}: {
  dev?: boolean;
  port?: number;
  routes: {
    name: string;
    path: string;
    posixPath: string;
    ext: string;
    route: string;
    dir: string;
    modName: string;
    mod: any;
  }[];
}) {
  const app = await createApp(dev, routes);
  console.log("server running at http://localhost:" + port);
  return app.listen({
    port,
  });
}
