import { createSignal } from "solid-js";
import type { Commit } from "../../../../core/src/github";
import { cls } from "../../base/styles";

export interface ChangedFileProps {
  file: Commit["files"][number];
}

export function ChangedFile({ file }: ChangedFileProps) {
  const [opened, open] = createSignal(false);

  return (
    <div>
      <div 
        onClick={() => open(o => !o)}
        class="p-1 flex gap-1 items-center rounded cursor-pointer hover:bg-zinc-200 transition-all"
      >
        <svg
          class={cls("size-3 shrink-0 stroke-zinc-500", opened() && "rotate-90")}
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width={1.5} 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <div class="w-full flex gap-8">
          <span class="w-96 grow text-zinc-600 text-sm">{file.filename}</span>
          <span class="w-14 text-zinc-500 text-sm">{file.status}</span>
          <span class="w-8 text-lime-700 text-sm">+{file.additions}</span>
          <span class="w-8 text-rose-700 text-sm">-{file.deletions}</span>
        </div>
      </div>
      {opened() && (
        <div class="pl-4 pt-1">
          <div class="max-h-96 w-full border border-zinc-400 rounded overflow-auto">
            <div class="text-zinc-500 text-sm whitespace-pre font-mono">
              {file.patch.split("\n").map(line => 
                line.startsWith("@@") ? <p class="px-1 bg-indigo-50">{line}</p>
                : line.startsWith("+") ? (
                  <p class="px-1 bg-lime-50">
                    <span class="text-lime-700">+</span> {line.slice(1)}
                  </p>
                ) : line.startsWith("-") ? (
                  <p class="px-1 bg-rose-50">
                    <span class="text-rose-700">-</span> {line.slice(1)}
                  </p>
                ) : <p class="px-1"> {line}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
