import type { RedditAdsCredentials } from "./auth.js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const BASE_URL = "https://ads-api.reddit.com/api/v3";

let _version = "0.1.0";
try {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const pkg = JSON.parse(
    readFileSync(join(__dirname, "..", "package.json"), "utf-8")
  );
  _version = pkg.version;
} catch {
  // fallback to default
}

function getUserAgent(creds: RedditAdsCredentials): string {
  const user = creds.username ?? "unknown";
  return `cli:reddit-ads-cli:v${_version} (by /u/${user})`;
}

export interface ApiOptions {
  creds: RedditAdsCredentials;
  method?: "GET" | "POST";
  params?: Record<string, string>;
  body?: Record<string, unknown>;
}

export async function callApi(
  endpoint: string,
  opts: ApiOptions
): Promise<unknown> {
  const method = opts.method ?? "GET";
  let url = `${BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${opts.creds.access_token}`,
    "User-Agent": getUserAgent(opts.creds),
    "Content-Type": "application/json",
  };

  if (method === "GET" && opts.params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(opts.params)) {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, value);
      }
    }
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const fetchOpts: RequestInit = { method, headers };
  if (method === "POST" && opts.body) {
    fetchOpts.body = JSON.stringify(opts.body);
  }

  const res = await fetch(url, fetchOpts);
  const json = (await res.json()) as Record<string, unknown>;

  if (!res.ok) {
    const msg =
      (json.message as string) ??
      (json.error as string) ??
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return json.data ?? json;
}
