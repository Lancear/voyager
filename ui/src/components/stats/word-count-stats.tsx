import { createSignal, For, type Accessor } from "solid-js";
import type { FullCommit } from "../../../../core/src/github";
import { cls } from "../../base/styles";

function getWords(str: string| undefined) {
  return str?.match(/([A-Z]?[a-z]+)|([A-Z]+(?![a-z]))/g) ?? [];
}

export interface WordCountStatsEntry {
  word: string;
  count: number;
}

function getWordCountStats(commit: FullCommit | undefined) {
  const stats = new Map<string, WordCountStatsEntry>();

  for (const file of commit?.tree.tree ?? []) {
    const words = getWords(file.path);

    for (const word of words) {
      if (stats.has(word)) {
        const wordStats = stats.get(word)!;
        wordStats.count++;
      }
      else {
        stats.set(word, {
          word,
          count: 1,
        });
      }
    }
  }

  return stats;
}

export interface WordCountStatsProps {
  commit: Accessor<FullCommit | undefined>;
}

export function WordCountStats({ commit }: WordCountStatsProps) {
  const wordCountStats = () => getWordCountStats(commit());

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
        <p class="text-zinc-600 mb-1">File Name Word Counts</p>
      </div>
      {opened() && (
        <div class="px-2 flex flex-col gap-0.5">
          <For each={wordCountStats()?.values().toArray().sort((a, b) => b.count - a.count)}>
            {(stat) => (
              <div class="w-full flex gap-8">
                <span class="w-96 grow text-sm text-zinc-600">
                  {stat.word}
                </span>
                <span class="w-8 text-lime-700 text-sm">+{stat.count}</span>
              </div>
            )}
          </For>
        </div>
      )}
    </div>
  );
}
