import { createSignal, For, type Resource } from "solid-js";
import { cls } from "../../../base/styles";
import type { GitTree, } from "../../../../../core/src/github";
import { FileTreeEntry } from "./file-tree-entry";
import { gitPathTree, moveFoldersToTop } from "./logic";

export interface CommitTimelineProps {
  gitTree: Resource<GitTree | undefined>;
}

export function FileTree({ gitTree }: CommitTimelineProps) {
  const [opened, open] = createSignal(true);
  const pathTree = () => gitPathTree(gitTree());

  return (
    <div class={cls(
      "w-full flex flex-col bg-zinc-100 rounded",
      opened() ? "h-1/2 grow" : "shrink-0",
    )}>
      <div 
        onClick={() => open(o => !o)}
        class={cls(
          "py-2 px-3 flex gap-2 items-center rounded-t cursor-pointer",
          "hover:bg-indigo-500 hover:bg-opacity-5 transition-all",
          opened() && "border-b border-zinc-300",
        )}>
        <svg
          class={cls("size-4  shrink-0 stroke-zinc-500", opened() && "rotate-90")}
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width={1.5} 
          stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <p class="text-zinc-800 text-lg">File Tree</p>
      </div>
      {opened() && (
        <div class="w-full h-full py-1.5 flex flex-col overflow-auto">
          <For each={moveFoldersToTop(pathTree()?.entries().toArray())}>
            {([filename, tree]) => (
              <FileTreeEntry 
                filename={filename} 
                tree={tree.size > 0 ? tree : undefined} />
            )}
          </For>
        </div> 
      )}
    </div>
  );
}
