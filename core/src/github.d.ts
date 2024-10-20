export interface RepositoryIdentity {
  readonly owner: string;
  readonly repository: string;
}

export interface GitObjectIdentity extends RepositoryIdentity {
  readonly sha: string;
}

export interface Commit {
  readonly sha: string;
  readonly url: string;
  readonly commit: {
    readonly message: string;
    readonly tree: {
      readonly sha: string;
      readonly url: string;
    },
    readonly author: {
      readonly name: string;
      readonly email: string;
      readonly date: string;
    },
  };
  readonly files: {
    readonly sha: string;
    readonly filename: string;
    /** e.g. added, modified */
    readonly status: string;
    readonly additions: number;
    readonly deletions: number;
    readonly changes: number;
    readonly patch: string;
  }[];
}

export type ListCommitsEntry = Omit<Commit, "files">;

export interface GitBlob {
  readonly sha: string;
  readonly url: string;
  readonly size: number,
  readonly content: string;
  /** e.g. base64 */
  readonly encoding: string;
}

export interface GitTree {
  readonly sha: string;
  readonly url: string;
  readonly truncated: boolean;
  readonly tree: GitTreeObject[];
}

export interface GitTreeObject {
  readonly path: string;
  /** e.g. blob, tree */
  readonly type: string;
  readonly sha: string;
  readonly url: string;
  readonly size?: number;
  readonly mode: string;
}

export interface FetchPaginationOptions {
  /** default: 30, max: 100 */
  readonly per_page?: number;
  readonly page?: number;
}

export interface FetchGitTreeOptions {
  readonly recursive?: boolean;
}

/**
 * Fetches a given github api url.
 * 
 * @throws "Fetch failed" Error
 * @throws "Failed to get response body as text" Error
 * @throws "Status code not ok" Error
 * @throws "Json parse failed" Error
 */
export function fetchUrl(url: string, queryOptions?: object): Promise<unknown>;

/**
 * Fetches github commits.
 * 
 * @throws "Fetch failed" Error
 * @throws "Failed to get response body as text" Error
 * @throws "Status code not ok" Error
 * @throws "Json parse failed" Error
 */
export function fetchCommits(
  identityOrUrl: RepositoryIdentity | string,
  options?: FetchPaginationOptions,
): Promise<ListCommitsEntry[]>;

/**
 * Fetches a given github commit.
 * 
 * @throws "Fetch failed" Error
 * @throws "Failed to get response body as text" Error
 * @throws "Status code not ok" Error
 * @throws "Json parse failed" Error
 */
export function fetchCommit(identityOrUrl: GitObjectIdentity | string): Promise<Commit>;

/**
 * Fetches a given github git blob.
 * 
 * @throws "Fetch failed" Error
 * @throws "Failed to get response body as text" Error
 * @throws "Status code not ok" Error
 * @throws "Json parse failed" Error
 */
export function fetchGitBlob(identityOrUrl: GitObjectIdentity | string): Promise<GitBlob>;

/**
 * Fetches a given github git tree.
 * 
 * If truncated is true in the response then the number of items in the tree array exceeded our maximum limit. To fetch more items, use the non-recursive method of fetching trees, and fetch one sub-tree at a time.
 * 
 * The limit for the tree array is 100,000 entries with a maximum size of 7 MB when using the recursive parameter.
 * 
 * @throws "Fetch failed" Error
 * @throws "Failed to get response body as text" Error
 * @throws "Status code not ok" Error
 * @throws "Json parse failed" Error
 */
export function fetchGitTree(
  identityOrUrl: GitObjectIdentity | string,
  options?: FetchGitTreeOptions
): Promise<GitTree>;
