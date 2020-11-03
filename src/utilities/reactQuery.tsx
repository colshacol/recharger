import { QueryCache, ReactQueryCacheProvider } from "react-query"

export const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      // staleTime: 120000,
      // refetchOnWindowFocus: false,
    },
  },
})

export const QueryCacheProvider = (props) => {
  return <ReactQueryCacheProvider {...props} queryCache={queryCache} />
}
