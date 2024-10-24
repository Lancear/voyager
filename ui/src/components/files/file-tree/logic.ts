import type { Commit, GitTree } from "../../../../../core/src/github";

export interface PathTreeEntry {
  /** Only set for files */
  sha?: string;
  name: string;
  /** Empty for files */
  tree: PathTree;
  path: string;
  status?: string;
}

export type PathTree = Map<string, PathTreeEntry>;

export function gitPathTree(
  gitTree: GitTree | undefined,
  changedFiles?: Commit["files"]
) {
  if (!gitTree) return undefined;

  const pathTree: PathTree = new Map();

  for (const file of changedFiles ?? []) {
    let cursor = pathTree;
    const pathParts = file.filename.split("/");

    for (let idx = 0; idx < pathParts.length - 1; idx++) {
      const name = pathParts[idx];

      if (!cursor.has(name)) {
        cursor.set(name, {
          name: name,
          path: pathParts.slice(0, idx + 1).join("/"),
          tree: new Map(),
        });
      }

      cursor = cursor.get(name)?.tree!;
    }

    const name = pathParts.at(-1)!;
    cursor.set(name, {
      sha: file.sha,
      name: name,
      path: file.filename,
      status: file.status,
      tree: new Map(),
    });
  }

  for (const entry of gitTree.tree) {
    if (entry.type !== "blob") continue;

    let cursor = pathTree;
    const pathParts = entry.path.split("/");

    for (let idx = 0; idx < pathParts.length - 1; idx++) {
      const name = pathParts[idx];

      if (!cursor.has(name)) {
        cursor.set(name, {
          name: name,
          path: pathParts.slice(0, idx + 1).join("/"),
          tree: new Map(),
        });
      }

      cursor = cursor.get(name)?.tree!;
    }

    const name = pathParts.at(-1)!;
    cursor.set(name, {
      sha: entry.sha,
      name: name,
      path: entry.path,
      tree: new Map(),
    });
  }

  return pathTree;
}

export function moveFoldersToTop(entries: PathTreeEntry[] | undefined) {
  return entries?.sort((a, b) => {
    if (a.tree.size > 0 && b.tree.size > 0) return a.name.localeCompare(b.name);
    if (a.tree.size > 0) return -1;
    if (b.tree.size > 0) return 1;
    return a.name.localeCompare(b.name);
  });
}
