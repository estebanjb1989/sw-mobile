REPORT.md

Data layer choice: I selected Zustand because it provides a minimal, fast, and explicit global state layer with no boilerplate. It offers full control over fetch logic, cache policy, and update merging without the abstraction overhead of RTK Query or React Query.

Data merging: The data layer normalizes posts and enriches them with their related comments via attachCommentsToPosts, enabling instant access in detail screens and avoiding repeated lookups.

Retry & backoff: Network requests use fetch-retry with exponential backoff (Math.pow(2, attempt) * delay). Errors are caught and logged through a mock log(error, context) function, meeting error-handling requirements.

Cache strategy: A custom cache policy was implemented using staleTime, cacheTime, and a lastFetchedAt timestamp. Fresh data skips refetching, while expired data is invalidated and removed from the store.

Error Boundary: A global Error Boundary wraps the RootLayout to capture React render failures, provide a safe fallback UI, and log errors without crashing the entire app.

AI usage: ChatGPT was used to speed up and refine code but I knew everything I asked for.