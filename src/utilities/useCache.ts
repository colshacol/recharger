import { createContextHook } from "@kensie/create-context-hook"
import { useImmer } from "use-immer"
import store from "store"

export const [CacheProvider, useCachedStuff] = createContextHook(() => {
  const [cache, updateCache] = useImmer({
    discounts: store.get("cache:discounts") || [],
    addresses: store.get("cache:addresses") || [],
    subscriptions: store.get("cache:subscriptions") || [],
    customers: store.get("cache:customers") || [],
  })

  function setCache(key, newData) {
    store.set(`cache:${key}`, newData)
    updateCache((draft) => {
      draft[key] = newData
    })
  }

  return {
    cache,
    setCache,
  }
})
