export function log(error: unknown, context: string) {
  console.error(`(LOG:${context})`, error);
}
