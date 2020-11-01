import { queryCache } from "../reactQuery"
import { useQuery, useMutation } from "react-query"
import { fetcher } from "./fetcher"

export const rechargeFetcher = fetcher

export const useRecharge = (options) => {
  const { key, ...otherOptions } = options
  const fetch = () => fetcher.get(otherOptions)
  const query = useQuery(key, fetch)
  return query
}
