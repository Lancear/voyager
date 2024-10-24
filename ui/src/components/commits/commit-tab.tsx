import type { Accessor, Resource, Setter } from "solid-js";
import type { FullCommit } from "../../../../core/src/github";
import { CommitDetails } from "./commit-details";
import { Stats } from "../stats/stats";
import type { Tab } from "../../base/tabs/create-tab-manager";

export interface CommitTabProps  {
  commit: FullCommit;
  selectCommit: Setter<FullCommit | undefined>;
  commits: Resource<FullCommit[]>;
}

export function newCommitTab({ 
  commit, 
  selectCommit, 
  commits 
}: CommitTabProps): Tab {
  return {
    id: `commit-${commit.sha}`,
    name: commit.commit.message.length > 24 
      ? `${commit.commit.message.slice(0, 23)}…` 
      : commit.commit.message,
    onSelect() {
      selectCommit(commit);
    },
    onHide() {
      selectCommit(undefined);
    },
    iconPath() {
      return (
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      );
    },
    renderer() {
      return <CommitTabContent commit={() => commit} commits={commits} />;
    },
  };
}

export interface CommitTabContentProps {
  commit: Accessor<FullCommit>;
  commits: Resource<FullCommit[]>;
}

export function CommitTabContent({ commit, commits }: CommitTabContentProps) {
  return (
    <div class="w-full h-full flex flex-col gap-6 overflow-auto">
      <CommitDetails commit={commit} />
      <Stats commit={commit} commits={commits} />
    </div>
  );
}

