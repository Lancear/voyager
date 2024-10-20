import { For, type Resource } from "solid-js";
import { formatDateTime } from "../../base/date";
import { ChangedFile } from "../files/changed-file";
import type { Commit } from "../../../../core/src/github";

export interface CommitDetailsProps {
  commitDetails: Resource<Commit | undefined>;
}

export function CommitDetails({ commitDetails }: CommitDetailsProps) {
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
            <p class="text-zinc-500 text-sm">{commitDetails()?.commit.author.name}</p>
            <p class="text-zinc-500 text-sm">{formatDateTime(commitDetails()?.commit.author.date)}</p>
            <p class="text-zinc-500 text-sm whitespace-pre">{commitDetails()?.commit.message}</p>
          </div>
        </div>
      </div>
      <div class="py-2 px-3">
        <p class="text-zinc-700 mb-1">Changed Files</p>
          <div class="flex flex-col gap-0.5">
            <For each={commitDetails()?.files}>
              {(file) => (
                <ChangedFile file={file} />
              )}
            </For>
          </div>
      </div>
    </div>
  );
}
