export const getCache = async (cacheName) => {
  const cache = await caches.open(cacheName)
  return cache
}
