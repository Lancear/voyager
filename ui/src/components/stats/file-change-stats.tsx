import { createSignal, For, type Accessor, type Resource } from "solid-js";
import type { FullCommit } from "../../../../core/src/github";
import { cls } from "../../base/styles";
import { STATUS_STYLES } from "../files/file-tree/file-tree-entry";

export interface FileChangeStatsEntry {
  filename: string;
  commits: number;
  additions: number;
  deletions: number;
  status?: string;
}

function getFileChangedStats(commit: FullCommit | undefined) {
  const stats = new Map<string, FileChangeStatsEntry>();

  for (const changedFile of commit?.files ?? []) {
    stats.set(changedFile.filename, {
      filename: changedFile.filename,
      commits: 1,
      additions: changedFile.additions,
      deletions: changedFile.deletions,
    });
  }

  return stats;
}

export interface FileChangeStatsProps {
  commit: Accessor<FullCommit | undefined>;
  commits: Resource<FullCommit[]>
}

export function FileChangeStats({ commit, commits }: FileChangeStatsProps) {
  const cumulativeStats = () => {
    const commitIdx = commits()?.findIndex(c => c.sha === commit()?.sha);
    if (commitIdx === undefined || commitIdx === -1) return undefined;

    const commitsSofar = commits()?.slice(0, commitIdx + 1);
    const cumulativeStats = new Map<string, FileChangeStatsEntry>();

    for (const commit of commitsSofar ?? []) {
      const commitStats = getFileChangedStats(commit);

      for (const commitFileStats of commitStats.values()) {
        if (cumulativeStats.has(commitFileStats.filename)) {
          const fileStats = cumulativeStats.get(commitFileStats.filename)!;
          fileStats.commits++;
          fileStats.additions += commitFileStats.additions;
          fileStats.deletions += commitFileStats.deletions;
        }
        else {
          cumulativeStats.set(commitFileStats.filename, commitFileStats);
        }
      }
    }

    for (const changedFile of commit()?.files?? []) {
      const fileStats = cumulativeStats.get(changedFile.filename)!;
      fileStats.status = changedFile.status;
    }

    return cumulativeStats;
  };

  const [opened, open] = createSignal(true);

  return (
    <div class="pt-1 pb-2 px-3">
      <div 
        onClick={() => open(o => !o)}
        class="p-1 flex gap-1 items-center rounded cursor-pointer hover:bg-zinc-200 transition-all"
      >
        <svg
          class={cls("size-3.5 shrink-0", opened() && "rotate-90")}
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width={1.5} 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <p class="text-zinc-600 mb-1">Cumulative File Changes</p>
      </div>
      {opened() && (
        <div class="px-2 flex flex-col gap-0.5">
          <For each={cumulativeStats()?.values().toArray().sort((a, b) => b.commits - a.commits)}>
            {(file) => (
              <div class="w-full flex gap-8">
                <span
                  class={cls(
                    "w-96 grow text-sm", 
                    STATUS_STYLES[file.status!] ?? "text-zinc-600"
                  )}
                >
                  {file.filename}
                </span>
                <span class="w-20 text-zinc-500 text-sm">{file.commits} Commits</span>
                <span class="w-8 text-lime-700 text-sm">+{file.additions}</span>
                <span class="w-8 text-rose-700 text-sm">-{file.deletions}</span>
              </div>
            )}
          </For>
        </div>
      )}
    </div>
  );
}
