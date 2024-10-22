import { createSignal, For } from "solid-js";
import { cls } from "../../../base/styles";
import { moveFoldersToTop, type PathTreeEntry } from "./logic";

export const STATUS_STYLES: Record<string, string> = {
  "added": "text-lime-600",
  "removed": "text-rose-600",
  "modified": "text-indigo-600",
};


export interface FileTreeEntryProps {
  entry: PathTreeEntry;
}

export function FileTreeEntry({ entry }: FileTreeEntryProps) {
  const canOpen = Boolean(entry.tree && entry.tree.size > 0);
  const [opened, open] = createSignal(false);

  return (
    <div class="py-0.5 px-1" data-path={entry.path}>
      <div 
        onClick={canOpen ? () => open(o => !o) : undefined}
        class={cls(
          "p-1 flex gap-1 items-center rounded cursor-pointer hover:bg-zinc-200 transition-all",
          STATUS_STYLES[entry.status!] ?? "text-zinc-600"
        )}
      >
        <svg
          class={cls("size-3.5 shrink-0", opened() && "rotate-90")}
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width={1.5} 
          stroke="currentColor"
        >
          {canOpen ? (
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          ) : entry.status === "added" ? (
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          ) : entry.status === "removed" ? (
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          ) : (
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          )}
        </svg>
        <span class="w-96 text-sm">{entry.name}</span>
      </div>
      {canOpen && opened() && (
        <div class="pl-2">
          <div class="border-l border-zinc-200 flex flex-col">
            <For each={moveFoldersToTop(entry.tree?.values().toArray())}>
              {(entry) => (
                <FileTreeEntry entry={entry} />
              )}
            </For>
          </div>
        </div>
      )}
    </div>
  );
}
