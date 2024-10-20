import { createSignal, For } from "solid-js";
import { cls } from "../../../base/styles"
import { moveFoldersToTop, type PathTree } from "./logic";

export interface FileTreeEntryProps {
  filename: string;
  tree?: PathTree;
}

export function FileTreeEntry({ filename, tree }: FileTreeEntryProps) {
  const canOpen = Boolean(tree);
  const [opened, open] = createSignal(false);

  return (
    <div class="py-0.5 px-1">
      <div 
        onClick={canOpen ? () => open(o => !o) : undefined}
        class="p-1 flex gap-1 items-center rounded cursor-pointer hover:bg-zinc-200 transition-all">
        <svg
        class={cls("size-3 shrink-0 stroke-zinc-400", opened() && "rotate-90")}
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke-width={1.5} 
        stroke="currentColor">
          {canOpen ? (
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          ) : (
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          )}
        </svg>
        <span class="w-96 text-zinc-600 text-sm">{filename}</span>
      </div>
      {canOpen && opened() && (
        <div class="pl-2">
          <div class="border-l border-zinc-200 flex flex-col">
            <For each={moveFoldersToTop(tree?.entries().toArray())}>
              {([filename, tree]) => (
                <FileTreeEntry 
                  filename={filename} 
                  tree={tree.size > 0 ? tree : undefined} />
              )}
            </For>
          </div>
        </div>
      )}
    </div>
  );
}
