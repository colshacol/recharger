// import qs from "query-string"
import qs from "query-string"
import { useMutation, useQuery } from "react-query"
import { fetcher } from "./fetcher"
import { queryCache } from "./reactQuery"

export const useCustomerPage = (id) => {
  const which = "getCustomerPage"
  const key = qs.stringify({ which, id })
  const fetch = () => fetcher[which](id)
  const query = useQuery(key, fetch)
  return query
}

export const useRecharge = (which, options = {}) => {
  console.log("useRecharge", { which, options })
  const key = qs.stringify({ which, ...options })
  const fetch = () => fetcher[which](options)
  const query = useQuery(key, fetch)
  return query
}

export const useRechargeMutation = (options) => {
  const fetch = (args) => fetcher.get({ ...args, ...options })
  const query = useMutation(fetch)
  return query
}

export const useDiscountCodeFixer = (id) => {
  const query = useRechargeMutation({ method: "replaceCode" })

  const fixCode = {
    status: query[1].status,
    data: query[1].data,
    error: query[1].error,
    mutate: async (args) => {
      const data = await query[0](args)
      const key = qs.stringify({ which: "getCustomerPageData", id })
      queryCache.invalidateQueries(key)
    },
  }

  return fixCode
}
