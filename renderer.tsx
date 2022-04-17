/** @jsx h */

// deno-lint-ignore-file no-explicit-any
import { renderToString } from "https://esm.sh/react-dom/server";
import { RC, Request, h } from "./refuse.ts";

export const DevScript: RC = ({ request: req }) =>
  req.dev ? (
    <script
      dangerouslySetInnerHTML={{
        __html: `const ws=new WebSocket("ws://127.0.0.1:5555");ws.onopen=e=>{console.log("Dev Server connected")},ws.onmessage=e=>{"reload"===e.data&&location.reload()};`,
      }}
    ></script>
  ) : null;

export function renderView(Component: RC<any>, props: any = {}) {
  return "<!DOCTYPE html>" + renderToString(<Component {...props} />);
}

export function composeLayout(
  req: Request,
  Layout: RC<any>,
  Component: RC<any>
) {
  return () => (
    <Layout request={req}>
      <Component request={req} />
      <DevScript request={req} />
    </Layout>
  );
}
