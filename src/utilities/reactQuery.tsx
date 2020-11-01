import { QueryCache, ReactQueryCacheProvider } from "react-query"

export const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

export const QueryCacheProvider = (props) => {
  return <ReactQueryCacheProvider {...props} queryCache={queryCache} />
}
