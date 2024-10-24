import type { Commit, FullCommit, GitBlob, GitTree } from "../../core/src/github";

export async function fetchCommits(): Promise<FullCommit[]> {
  const res = await fetch("http://localhost:3300/full/commits");
  return res.json();
}

export async function fetchCommit(sha: string): Promise<Commit | undefined> {
  if (!sha) return undefined;

  const res = await fetch("http://localhost:3300/commits/" + sha);
  return res.json();
}

export async function fetchGitTree(sha: string): Promise<GitTree | undefined> {
  if (!sha) return undefined;

  const res = await fetch("http://localhost:3300/git/trees/" + sha);
  return res.json();
}

export async function fetchGitBlob(sha: string): Promise<GitBlob | undefined> {
  if (!sha) return undefined;

  const res = await fetch("http://localhost:3300/git/blobs/" + sha);
  return res.json();
}
