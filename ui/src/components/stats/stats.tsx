import { type Accessor, type Resource } from "solid-js";
import type { FullCommit } from "../../../../core/src/github";
import { FileChangeStats } from "./file-change-stats";
import { WordCountStats } from "./word-count-stats";

export interface StatsProps {
  commit: Accessor<FullCommit | undefined>;
  commits: Resource<FullCommit[]>
}

export function Stats({ commit, commits }: StatsProps) {
  return (
    <div>
      <div class="pt-2 px-3">
        <p class="text-zinc-700 font-medium mb-1">Stats</p>
      </div>
      <FileChangeStats commit={commit} commits={commits} />
      <WordCountStats commit={commit} />
    </div>
  );
}
