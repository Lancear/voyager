import type { GitTree } from "../../../../../core/src/github";

export type PathTree = Map<string, PathTree>;

export function gitPathTree(gitTree: GitTree | undefined) {
  if (!gitTree) return undefined;

  const pathTree: PathTree = new Map();

  for (const entry of gitTree.tree) {
    if (entry.type !== "blob") continue;

    let cursor = pathTree;

    for (const part of entry.path.split("/")) {
      if (!cursor.has(part)) {
        cursor.set(part, new Map());
      }

      cursor = cursor.get(part)!;
    }
  }

  return pathTree;
}

export function moveFoldersToTop(entries: [string, PathTree][] | undefined) {
  return entries?.sort(([, a], [, b]) => {
    if (a.size > 0 && b.size > 0) return 0;
    if (a.size > 0) return -1;
    if (b.size > 0) return 1;
    return 0;
  });
}
