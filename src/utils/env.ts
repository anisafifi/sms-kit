export function readEnv(key: string): string | undefined {
  if (typeof process === "undefined") {
    return undefined;
  }

  return process.env?.[key];
}
