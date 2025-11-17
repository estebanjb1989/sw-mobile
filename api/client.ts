import { log } from "@/utils/log";
import fetchRetry from "fetch-retry";

const fetchWithRetry = fetchRetry(fetch);

export async function fetchPosts<T>(): Promise<T[] | undefined> {
  try {
    const response = await fetchWithRetry(
      "https://jsonplaceholder.typicode.com/posts",
      {
        retries: 3,
        retryDelay: (attempt) => Math.pow(2, attempt) * 300,
        retryOn: [429, 500, 502, 503, 504],
      }
    );

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      log(error, "fetchPosts:bad_status");
      throw error;
    }

    return (await response.json()) as T[];

  } catch (err) {
    log(err, "fetchPosts:network_or_parse_error");
    return undefined;
  }
}
