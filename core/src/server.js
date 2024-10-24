import { serve } from "@hono/node-server";
import { Hono } from "hono";
import pLimit from "p-limit";
import fs from "fs/promises";
import * as github from "./github.js";

const owner = "Lancear";
const repository = "oop-shop-project";

const app = new Hono();

app.use(async (ctx, next) => {
  ctx.header("Access-Control-Allow-Origin", "http://localhost:3000");
  await next();
});

app.get("/full/commits", async (ctx) => {
  try {
    const cache = await fs.readFile("examples/full-commits.json", "utf8");
    console.log("Cache used");

    ctx.status(200);
    return ctx.json(JSON.parse(cache).reverse());
  } catch { }

  try {
    const commits = [];

    // fetch base commits
    const { items, next } = await github.fetchCommits({ owner, repository }, { per_page: 100 });
    commits.push(...items);
    let nextUrl = next;

    while (nextUrl) {
      const { items, next } = await github.fetchCommits(nextUrl);
      commits.push(...items);
      nextUrl = next;
    }

    const limit = pLimit(10);

    const commitsWithDetails = await Promise.all(
      commits.map(c => limit(() => github.fetchCommit({ owner, repository, sha: c.sha })))
    );

    const commitswithFileTrees = await Promise.all(
      commitsWithDetails.map(c => limit(async () => ({
        ...c,
        tree: await github.fetchGitTree(
          { owner, repository, sha: c.commit.tree.sha },
          { recursive: true }
        )
      })))
    );

    await fs.writeFile(
      "examples/full-commits.json",
      JSON.stringify(commitswithFileTrees, null, 2),
      "utf8"
    );

    ctx.status(200);
    return ctx.json(commitswithFileTrees.reverse());
  }
  catch (err) {
    ctx.status(400);
    return ctx.json({ err });
  }
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

app.get("/git/blobs/:sha", async (ctx) => {
  const { sha } = ctx.req.param()

  try {
    const gitBlob = await github.fetchGitBlob(
      { owner, repository, sha },
    );

    ctx.status(200);
    return ctx.json(gitBlob);
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
