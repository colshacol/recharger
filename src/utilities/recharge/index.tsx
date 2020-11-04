import { queryCache } from "../reactQuery"
import qs from "query-string"
import { useQuery, useMutation } from "react-query"
import { fetcher } from "../recharge"

export const useRecharge = (which, options = {}) => {
  const key = qs.stringify({ which, ...options })
  const fetch = () => fetcher.get(options)
  const query = useQuery(key, fetch)
  return query
}

export const useRechargeMutation = (options) => {
  const fetch = (args) => fetcher.get({ ...args, ...options })
  const query = useMutation(fetch)
  return query
}
