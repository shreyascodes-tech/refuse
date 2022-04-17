// deno-lint-ignore-file no-explicit-any ban-types
import {
  Request as Req,
  RouteParams,
} from "https://deno.land/x/oak@v10.5.1/mod.ts";
import {
  ResponseBody,
  ResponseBodyFunction,
} from "https://deno.land/x/oak@v10.5.1/response.ts";
import React from "https://esm.sh/react";
import { renderView } from "./renderer.tsx";

export { runApp } from "./server.ts";

export type Request = Req & {
  params: RouteParams<any>;
  dev: boolean;
};

export type Response =
  | {
      status?: number;
      body?: ResponseBody | ResponseBodyFunction;
      headers?: [string, string][];
    }
  | {
      redirect: string;
    };

export type RequestHandler = (request: Request) => Promise<Response> | Response;
export type RequestComponent<T = {}> = React.FC<
  {
    request: Request;
  } & T
>;

export type RC<T = {}> = RequestComponent<T>;

export const json: (res: {
  status?: number;
  body?: ResponseBody | ResponseBodyFunction;
  headers?: [string, string][];
}) => Response = ({ status, headers = [], body }) => ({
  status,
  body: JSON.stringify(body),
  headers: [["Content-Type", "application/json"], ...headers],
});

export const jsx: (
  view: RC<any>,
  options?: {
    status?: number;
    headers?: [string, string][];
  }
) => Response = (view, props = {}, { status = 200, headers = [] } = {}) => ({
  status,
  body: renderView(view, props),
  headers: [["Content-Type", "text/html"], ...headers],
});

export const redirect: (url: string) => Response = (url) => ({
  redirect: url,
});

export { DevScript } from "./renderer.tsx";

export const h = React.createElement;
