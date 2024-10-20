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

    console.log();
    console.log("Response for", urlWithQuery);
    console.log("Link header:", res.headers.get("link"));
    console.log();

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

/** @type {import("./github.js").fetchCommits} */
export function fetchCommits(identityOrUrl, options) {
  if (typeof identityOrUrl === "string") {
    // @ts-ignore
    return fetchUrl(identityOrUrl, options);
  }

  const { owner, repository } = identityOrUrl;

  // @ts-ignore
  return fetchUrl(
    `${GITHUB_API_BASE_URL}/repos/${owner}/${repository}/commits`,
    options,
  );
}

/** @type {import("./github.js").fetchCommit} */
export function fetchCommit(identityOrUrl) {
  if (typeof identityOrUrl === "string") {
    // @ts-ignore
    return fetchUrl(identityOrUrl);
  }

  const { owner, repository, sha } = identityOrUrl;

  // @ts-ignore
  return fetchUrl(
    `${GITHUB_API_BASE_URL}/repos/${owner}/${repository}/commits/${sha}`
  );
}

/** @type {import("./github.js").fetchGitBlob} */
export function fetchGitBlob(identityOrUrl) {
  if (typeof identityOrUrl === "string") {
    // @ts-ignore
    return fetchUrl(identityOrUrl);
  }

  const { owner, repository, sha } = identityOrUrl;

  // @ts-ignore
  return fetchUrl(
    `${GITHUB_API_BASE_URL}/repos/${owner}/${repository}/git/blobs/${sha}`
  );
}

/** @type {import("./github.js").fetchGitTree} */
export function fetchGitTree(identityOrUrl, options) {
  if (typeof identityOrUrl === "string") {
    // @ts-ignore
    return fetchUrl(identityOrUrl, options);
  }

  const { owner, repository, sha } = identityOrUrl;

  // @ts-ignore
  return fetchUrl(
    `${GITHUB_API_BASE_URL}/repos/${owner}/${repository}/git/trees/${sha}`,
    options,
  );
}
