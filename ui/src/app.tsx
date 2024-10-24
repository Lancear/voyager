import { createResource, createSignal } from "solid-js";
import { fetchCommits } from "./api";
import { CommitHistory } from "./components/commits/commit-history/commit-history";
import type { FullCommit } from "../../core/src/github";
import { FileTree } from "./components/files/file-tree/file-tree";
import { Tabs } from "./base/tabs/tabs";
import { createTabManager } from "./base/tabs/create-tab-manager";
import { newCommitTab } from "./components/commits/commit-tab";
import type { PathTreeEntry } from "./components/files/file-tree/logic";
import { newFileTab } from "./components/files/file-tab";

export function App() {
  const [commits] = createResource(fetchCommits);
  const [selectedCommit, selectCommit] = createSignal<FullCommit | undefined>(undefined);

  const tabManager = createTabManager({
    noTabRenderer() {
      return (
        <div class="relative h-full w-full flex flex-col">
          <div class="py-2 px-3 border-b border-zinc-300">
            <p class="text-zinc-700 text-lg">Analytics</p>
          </div>
          <div class="w-full h-full py-2 px-3">
            <p class="text-zinc-600 text-sm">Select a commit to get started.</p>
          </div>
        </div>
      );
    }
  });

  function openCommit(commit: FullCommit) {
    tabManager.openTab(newCommitTab({ commit, selectCommit, commits }));
  }

  function openFile(file: PathTreeEntry) {
    if (!file.sha) return;

    const commit = selectedCommit()!;
    tabManager.openTab(newFileTab({ file, commit, selectCommit }));
  }

  return (
    <div class="w-full h-screen p-2 flex gap-x-2 bg-zinc-300 ">
      <div class="relative h-full w-72 shrink-0 flex flex-col gap-2">
        <CommitHistory 
          commits={commits} 
          selectedCommit={selectedCommit} 
          openCommit={openCommit} />
        <FileTree 
          gitTree={() => selectedCommit()?.tree} 
          changedFiles={() => selectedCommit()?.files}
          openFile={openFile} />
      </div>

      <div class="h-full w-1/2 grow bg-zinc-100 rounded">
        <Tabs tabManager={tabManager} />
      </div>
    </div>
  );
}
