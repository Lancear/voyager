import { createResource, Show, type Accessor, type Setter } from "solid-js";
import type { FullCommit } from "../../../../core/src/github";
import type { Tab } from "../../base/tabs/create-tab-manager";
import type { PathTreeEntry } from "./file-tree/logic";
import { fetchGitBlob } from "../../api";

export interface FileTabProps  {
  file: PathTreeEntry;
  commit: FullCommit;
  selectCommit: Setter<FullCommit | undefined>;
}

export function newFileTab({ 
  file, 
  commit,
  selectCommit, 
}: FileTabProps): Tab {

  return {
    id: `file-${file.sha}`,
      name: file.name,
      iconPath() {
        return (
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        );
      },
      onSelect() {
        selectCommit(commit);
      },
      onHide() {
        selectCommit(undefined);
      },
    renderer() {
      return <FileTabContent file={() => file} />;
    },
  };
}

export interface FileTabContentProps {
  file: Accessor<PathTreeEntry>;
}

export function FileTabContent({ file }: FileTabContentProps) {
  const [gitBlob] = createResource(() => file().sha, fetchGitBlob);

  return (
    <div class="w-full h-full flex flex-col gap-2 overflow-auto">
      <p class="text-zinc-600">{file().name}</p>
      <Show when={gitBlob()} fallback={<p class="text-sm text-zinc-500">Loading file...</p>}>
        <div class="max-h-96 w-full px-1 border border-zinc-400 rounded overflow-auto">
          <div class="text-zinc-500 text-sm whitespace-pre font-mono">
            {atob(gitBlob()!.content)}
          </div>
        </div>
      </Show>
      
    </div>
  );
}

