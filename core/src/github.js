import process from "node:process";
import { addErrorContext, HttpError } from "./error-handling.js";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_API_BASE_URL = "https://api.github.com";

/** @type {import("./github.js").fetchUrl} */
export async function fetchUrl(url, queryOptions) {
  const urlWithQuery = queryOptions
    // @ts-ignore
    ? url + "?" + new URLSearchParams(queryOptions)
    : url;

  const errorContext = { module: "github", urlWithQuery };

  try {
    const res = await fetch(urlWithQuery, {
      headers: { Authorization: "Bearer " + GITHUB_TOKEN }
    });

    const bodyText = await res.text().catch(err => {
      throw addErrorContext(err, "Failed to get response body as text", errorContext)
    });

    if (!res.ok) {
      throw addErrorContext(
        new HttpError("Status code not ok", res.status, bodyText),
        errorContext
      );
    }

    try {
      return JSON.parse(bodyText);
    }
    catch (err) {
      throw addErrorContext(err, "Json parse failed", errorContext);
    }
  }
  catch (err) {
    throw addErrorContext(err, "Fetch failed", errorContext);
  }
}

/** @type {import("./github.js").fetchPaginatedUrl} */
export async function fetchPaginatedUrl(url, paginationOptions, queryOptions) {
  const urlWithQuery = paginationOptions || queryOptions
    // @ts-ignore
    ? url + "?" + new URLSearchParams({ ...queryOptions, ...paginationOptions })
    : url;

  const errorContext = { module: "github", paginated: true, urlWithQuery };

  try {
    const res = await fetch(urlWithQuery, {
      headers: { Authorization: "Bearer " + GITHUB_TOKEN }
    });

    const bodyText = await res.text().catch(err => {
      throw addErrorContext(err, "Failed to get response body as text", errorContext)
    });

    if (!res.ok) {
      throw addErrorContext(
        new HttpError("Status code not ok", res.status, bodyText),
        errorContext
      );
    }

    const linkHeader = res.headers.get("link");
    const linkHeaderEntries = linkHeader?.split(",").map(
      l => l.trim().slice(1, -1).split('>; rel="').reverse()
    );

    try {
      const pageLinks = Object.fromEntries(linkHeaderEntries ?? []);
      return Object.assign(pageLinks, { items: JSON.parse(bodyText) });
    }
    catch (err) {
      throw addErrorContext(err, "Json parse failed", errorContext);
    }
  }
  catch (err) {
    throw addErrorContext(err, "Fetch failed", errorContext);
  }
}

/** @type {import("./github.js").fetchCommits} */
export function fetchCommits(identityOrUrl, paginationOptions) {
  if (typeof identityOrUrl === "string") {
    return fetchPaginatedUrl(identityOrUrl, paginationOptions);
  }

  const { owner, repository } = identityOrUrl;

  return fetchPaginatedUrl(
    `${GITHUB_API_BASE_URL}/repos/${owner}/${repository}/commits`,
    paginationOptions,
  );
}

/** @type {import("./github.js").fetchCommit} */
export function fetchCommit(identityOrUrl) {
  if (typeof identityOrUrl === "string") {
    return fetchUrl(identityOrUrl);
  }

  const { owner, repository, sha } = identityOrUrl;

  return fetchUrl(
    `${GITHUB_API_BASE_URL}/repos/${owner}/${repository}/commits/${sha}`
  );
}

/** @type {import("./github.js").fetchGitBlob} */
export function fetchGitBlob(identityOrUrl) {
  if (typeof identityOrUrl === "string") {
    return fetchUrl(identityOrUrl);
  }

  const { owner, repository, sha } = identityOrUrl;

  return fetchUrl(
    `${GITHUB_API_BASE_URL}/repos/${owner}/${repository}/git/blobs/${sha}`
  );
}

/** @type {import("./github.js").fetchGitTree} */
export async function fetchGitTree(identityOrUrl, options) {
  if (typeof identityOrUrl === "string") {
    const res = await fetchUrl(identityOrUrl, options);

    if (res.truncated) {
      console.warn("Truncated git tree fetched")
    }

    return res;
  }

  const { owner, repository, sha } = identityOrUrl;

  const res = await fetchUrl(
    `${GITHUB_API_BASE_URL}/repos/${owner}/${repository}/git/trees/${sha}`,
    options,
  );

  if (res.truncated) {
    console.warn("Truncated git tree fetched")
  }

  return res;
}
