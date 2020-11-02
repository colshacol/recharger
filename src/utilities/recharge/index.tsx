import { queryCache } from "../reactQuery"
import { useQuery, useMutation } from "react-query"
import { fetcher } from "./fetcher"

export const useRecharge = (options) => {
  const { key, ...otherOptions } = options
  const fetch = () => fetcher.get(otherOptions)
  const query = useQuery(key, fetch)
  return query
}

export const useRechargeMutation = (options) => {
  const fetch = (args) => fetcher.get({ ...args, ...options })
  const query = useMutation(fetch)
  return query
}
