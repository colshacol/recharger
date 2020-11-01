import useSWR from "swr"
import qs from "query-string"
import store from "store"

export const fetcher = (useCache = true) => {
  return async (url: string, modifiers: any) => {
    console.log({ url })
    const cache = store.get(url)
    if (cache && useCache) return cache

    const response = await fetch(url, modifiers)
    const data = await response.json()
    const _data = data?.data || data
    store.set(url, _data)
    return _data
  }
}

function getOptions() {
  return {
    initialata: [],
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0,
  }
}

export function useRechargeApi({ useCache, ...query }) {
  const url = `/api/recharge`
  const endpoint = qs.stringifyUrl({ url, query })
  return useSWR(endpoint, fetcher(!!useCache), getOptions())
}
