export const API_TOKEN_STORAGE_KEY = "thek1ng237-proposal-api-token";

export function apiUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL n'est pas configurée.");
  }

  return new URL(path.startsWith("/") ? path.slice(1) : path, `${baseUrl.replace(/\/$/, "")}/`).toString();
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { locale?: string; token?: string } = {}
): Promise<T> {
  const url = new URL(apiUrl(path));

  if (init.locale) {
    url.searchParams.set("locale", init.locale);
  }

  const requestInit = { ...init };
  const token = requestInit.token;
  delete requestInit.locale;
  delete requestInit.token;
  const response = await fetch(url.toString(), {
    ...requestInit,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(requestInit.headers ?? {}),
    },
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload: unknown = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const errorMessage = typeof payload === "object" && payload !== null
      && "error" in payload && typeof payload.error === "object" && payload.error !== null
      && "message" in payload.error && typeof payload.error.message === "string"
      ? payload.error.message
      : typeof payload === "string" && payload
        ? payload
        : `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  if (typeof payload === "object" && payload !== null && "success" in payload && payload.success === true && "data" in payload) {
    return payload.data as T;
  }

  return payload as T;
}
