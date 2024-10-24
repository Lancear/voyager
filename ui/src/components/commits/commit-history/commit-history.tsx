import { createSignal, For, Show, type Accessor, type Resource } from "solid-js";
import { CommitHistoryEntry } from "./commit-history-entry";
import type { FullCommit } from "../../../../../core/src/github";
import { cls } from "../../../base/styles";

export interface CommitHistoryProps {
  commits: Resource<FullCommit[]>;
  selectedCommit: Accessor<FullCommit | undefined>;
  openCommit(commit: FullCommit): void;
}

export function CommitHistory({ commits, selectedCommit, openCommit }: CommitHistoryProps) {
  const [opened, open] = createSignal(true);

  return (
    <div 
      class={cls(
        "w-full flex flex-col bg-zinc-100 rounded",
        opened() ? "h-1/2 grow" : "shrink-0",
      )}
    >
      <div 
        onClick={() => open(o => !o)}
        class={cls(
          "py-2 px-3 flex gap-2 items-center rounded-t cursor-pointer",
          "hover:bg-indigo-500 hover:bg-opacity-5 transition-all",
          opened() && "border-b border-zinc-300",
        )}
      >
        <svg
          class={cls("size-4 shrink-0 stroke-zinc-500", opened() && "rotate-90")}
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width={1.5} 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <p class="text-zinc-800 text-lg">Commit History</p>
      </div>
      <Show when={opened()}>
        <div class="w-full h-full py-1.5 flex flex-col overflow-auto">
          <For each={commits()}>
            {(commit) => (
              <CommitHistoryEntry 
                commit={commit} 
                selected={() => selectedCommit()?.sha === commit.sha} 
                openCommit={openCommit} />
            )}
          </For>
        </div> 
      </Show>
    </div>
  );
}
