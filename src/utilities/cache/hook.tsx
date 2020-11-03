import { createContextHook } from "@kensie/create-context-hook"
import { useEffect, useState } from "react"
import { getCache } from "."

type PropsT = {
  cacheName: string
  staleTime: number
}

export const [CacheProvider, useCache] = createContextHook((props: PropsT) => {
  const [state, setState] = useState({
    cache: {},
    isCacheReady: false,
  })

  useEffect(() => {
    getCache(props.cacheName).then((cache) => {
      setState({ cache, isCacheReady: true })
    })
  }, [])

  return state
})
