const fallbackBaseUrl = "http://localhost:5000/api";

export const backendApiBaseUrl = (
  process.env.NEXT_PUBLIC_BACKEND_API_URL || fallbackBaseUrl
).replace(/\/+$/, "");

export const buildBackendApiUrl = (path = "") => {
  const normalizedPath = path.replace(/^\/+/, "");

  return normalizedPath
    ? `${backendApiBaseUrl}/${normalizedPath}`
    : backendApiBaseUrl;
};
