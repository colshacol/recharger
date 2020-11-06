export async function getPage([api, query = {}], index) {
  const page = typeof index === "number" ? index + 1 : 1
  return api.list({ limit: 250, page, ...query })
}

export async function listAll(api) {
  const count = await api.count()
  const pageCount = Math.ceil(count / 250)
  const iterable = Array(pageCount).fill([api])
  const promises = iterable.map(getPage)
  const pages = await Promise.all(promises)
  const items = pages.flat()
  return items
}
