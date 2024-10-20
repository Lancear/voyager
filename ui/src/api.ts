import type { Commit, GitTree, ListCommitsEntry } from "../../core/src/github";

export async function fetchCommits(): Promise<ListCommitsEntry[]> {
  const res = await fetch("http://localhost:3300/commits");
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

