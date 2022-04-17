# Refuse
A simple, fast file system based web framework for deno

## Getting Started

## Installing

This installs the rfc (refuse cli) to your system

```bash
deno install -A -r -f https://deno.land/x/refuse/rfc.ts
```

## Creating a project

In an empty folder from the terminal run

```bash
rfc init
```

This creates a basic file structure for the app

## Running the server

To start the server in development mode run

```bash
rfc dev
```

To start the server in production mode run

```bash
rfc start
```

## Generating the router

> Note before deployment run the following in the terminal from the project root

```bash
rfc gen router
```

This generates a router.ts file with all the route configuration used by refuse