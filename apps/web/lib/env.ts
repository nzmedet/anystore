function read(value: string | undefined, fallback = "") {
  return (value ?? fallback).trim();
}

export const webEnv = {
  appBaseUrl: read(process.env.NEXT_PUBLIC_APP_BASE_URL, "http://localhost:3000"),
  apiBaseUrl: read(process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL)
};
