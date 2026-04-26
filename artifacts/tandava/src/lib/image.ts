// When the API is hosted on a different origin (e.g. split Vercel projects),
// VITE_API_URL points at the API root so /api/storage/... resolves correctly.
const API_ORIGIN = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');

export function resolveImageUrl(url?: string) {
  if (!url) return '';
  if (url.startsWith('/objects/')) {
    return `${API_ORIGIN}/api/storage${url}`;
  }
  if (url.startsWith('http')) {
    return url;
  }
  return `${import.meta.env.BASE_URL}${url.replace(/^\//, '')}`;
}
