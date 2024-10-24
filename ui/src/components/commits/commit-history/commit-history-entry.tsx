import type { Accessor } from "solid-js";
import type { FullCommit } from "../../../../../core/src/github";
import { formatDate, formatDateTime } from "../../../base/date";
import { cls } from "../../../base/styles";

export interface CommitHistoryEntryProps {
  commit: FullCommit;
  selected: Accessor<boolean>;
  openCommit(commit: FullCommit): void;
}

export function CommitHistoryEntry({ commit, selected, openCommit }: CommitHistoryEntryProps) {
  return (
    <div class="py-0.5 px-1" data-sha={commit.sha}>
      <div 
        onClick={() => openCommit(commit)}
        class={cls(
          "py-1 px-2 rounded cursor-pointer hover:bg-indigo-500 hover:bg-opacity-10 transition-all", 
          selected() && "border-l-4 border-indigo-400"
        )}>
        <div class="flex justify-between gap-2">
          <div>
            <p class="text-zinc-600 text-sm line-clamp-2">{commit.commit.message.split("\n")[0]}</p>
            <p class="text-zinc-400 text-sm">{commit.commit.author.name}</p>
          </div>
          <div class="shrink-0 flex flex-col items-end">
            <p class="text-zinc-600 text-xs font-mono">#{commit.sha.slice(-7)}</p>
            <p class="text-zinc-400 text-xs" title={formatDateTime(commit.commit.author.date)}>
              {formatDate(commit.commit.author.date)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
