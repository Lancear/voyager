import { serve } from "@hono/node-server";
import { Hono } from "hono";
import fs from "fs/promises";
import * as github from "./github.js";

const owner = "Lancear";
const repository = "oop-shop-project";

const app = new Hono();

app.use(async (ctx, next) => {
  ctx.header("Access-Control-Allow-Origin", "http://localhost:3000");
  await next();
});

app.get("/commits", async (ctx) => {
  const commits = JSON.parse(await fs.readFile("examples/commits.json", "utf8"));
  commits.reverse();

  ctx.status(200);
  return ctx.json(commits);
});

app.get("/commits/:sha", async (ctx) => {
  const { sha } = ctx.req.param()

  try {
    const commit = await github.fetchCommit({ owner, repository, sha });

    ctx.status(200);
    return ctx.json(commit);
  }
  catch (err) {
    ctx.status(400);
    return ctx.json({ err });
  }
});

app.get("/git/trees/:sha", async (ctx) => {
  const { sha } = ctx.req.param()

  try {
    const gitTree = await github.fetchGitTree(
      { owner, repository, sha },
      { recursive: true }
    );

    ctx.status(200);
    return ctx.json(gitTree);
  }
  catch (err) {
    ctx.status(400);
    return ctx.json({ err });
  }
});

serve(
  { fetch: app.fetch, hostname: "localhost", port: 3300 },
  (info) => console.log(`Server running at http://localhost:${info.port}`),
);

