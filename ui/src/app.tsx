import { createEffect, createResource, createSignal, For } from "solid-js";
import { fetchCommit, fetchCommits, fetchGitTree } from "./api";
import { CommitHistory } from "./components/commits/commit-history/commit-history";
import type { ListCommitsEntry } from "../../core/src/github";
import { FileTree } from "./components/files/file-tree/file-tree";
import { CommitDetails } from "./components/commits/commit-details";

export function App() {
  const [commits] = createResource(fetchCommits);
  const [selectedCommit, selectCommit] = createSignal<ListCommitsEntry | undefined>(undefined);
  const [commitDetails] = createResource(() => selectedCommit()?.sha, fetchCommit);
  const [commitGitTree] = createResource(() => selectedCommit()?.commit.tree.sha, fetchGitTree);

  createEffect(() => {
    if ((commits()?.length ?? 0) > 0 && !selectedCommit()) {
      selectCommit(commits()?.[0]);
    }
  });

  return (
    <div class="w-full h-screen p-2 flex gap-x-2 bg-zinc-300 ">
      <div class="relative h-full w-72 shrink-0 flex flex-col gap-2">
        <CommitHistory 
          commits={commits} 
          selectedCommit={selectedCommit} 
          selectCommit={selectCommit} />
        <FileTree gitTree={commitGitTree} />
      </div>

      <div class="h-full w-1/2 grow bg-zinc-100 rounded">
        {selectedCommit() ? (
          <div class="relative h-full w-full flex flex-col">
            <div class="py-2 px-3 border-b border-zinc-300">
              <p class="text-zinc-800 text-lg">
                {selectedCommit()?.commit.message.split("\n")[0]} #{selectedCommit()?.sha.slice(-7)}
              </p>
            </div>
            <CommitDetails commitDetails={commitDetails} />
          </div>
        ) : (
          <div class="relative h-full w-full flex flex-col">
            <div class="py-2 px-3 border-b border-zinc-300">
              <p class="text-zinc-700 text-lg">Analytics</p>
            </div>
            <div class="w-full h-full py-2 px-3">
              <p class="text-zinc-600 text-sm">Select a commit to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
