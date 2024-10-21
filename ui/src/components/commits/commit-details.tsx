import { For, type Accessor } from "solid-js";
import { formatDateTime } from "../../base/date";
import { ChangedFile } from "../files/changed-file";
import type { FullCommit } from "../../../../core/src/github";

export interface CommitDetailsProps {
  commit: Accessor<FullCommit | undefined>;
}

export function CommitDetails({ commit }: CommitDetailsProps) {
  return (
    <div class="w-full h-full flex flex-col overflow-auto">
      <div class="py-2 px-3">
        <p class="text-zinc-700 mb-1">Information</p>
        <div class="flex gap-4">
          <div class="flex flex-col gap-0.5">
            <p class="text-zinc-600 text-sm">Author</p>
            <p class="text-zinc-600 text-sm">Timestamp</p>
            <p class="text-zinc-600 text-sm">Full Message</p>
          </div>
          <div class="flex flex-col gap-0.5">
            <p class="text-zinc-500 text-sm">{commit()?.commit.author.name}</p>
            <p class="text-zinc-500 text-sm">{formatDateTime(commit()?.commit.author.date)}</p>
            <p class="text-zinc-500 text-sm whitespace-pre">{commit()?.commit.message}</p>
          </div>
        </div>
      </div>
      <div class="py-2 px-3">
        <p class="text-zinc-700 mb-1">Changed Files</p>
          <div class="flex flex-col gap-0.5">
            <For each={commit()?.files}>
              {(file) => (
                <ChangedFile file={file} />
              )}
            </For>
          </div>
      </div>
    </div>
  );
}
