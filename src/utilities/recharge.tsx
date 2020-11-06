import store from "store"
// import qs from "query-string"
import qs from "query-string"
import { useMutation, useQuery } from "react-query"
import { fetcher } from "./fetcher"
import { queryCache } from "./reactQuery"

export { fetcher }
// export const useCustomerPage = (id) => {
//   const which = "getCustomerPage"
//   const key = qs.stringify({ which, id })
//   const fetch = () => fetcher[which](id)
//   const query = useQuery(key, fetch)
//   return query
// }

const shouldRetry = (count, error) => {
  console.log({ count, error })
  return false
}

const fetchAllCustomers = async () => {
  const response = await fetch("/api/v0/getCustomers")
  const json = await response.json()
  return json
}

const fetchPlease = async (url) => {
  const response = await fetch(url)
  const json = await response.json()
  return json
}

export const useAllCustomers = () => {
  const key = `/api/v0/getCustomers`
  const query = useQuery(key, () => fetchPlease(key))
  const data = store.get(key)
  query.data && store.set(key, query.data)

  return {
    ...query,
    data: query.data || data,
  }
}

const fetchCustomerPage = async (id) => {
  const response = await fetch(`/api/v0/getCustomerPage?id=${id}`)
  const json = await response.json()
  return json
}

export const useCustomerPage = (id) => {
  const key = `/api/v0/getCustomerPage?id=${id}`
  const query = useQuery(key, () => fetchPlease(key))
  return query
}

export const updateDiscountCode = async (options) => {
  const queryString = qs.stringify(options)
  console.log({ queryString })
  const response = await fetch("/api/v0/updateDiscountCode?" + queryString)
  const json = await response.json()
  return json
}

export const useDiscountFixer = () => {
  return useMutation(updateDiscountCode)
}

export const useProducts = () => {
  const key = `/api/v0/getProducts`
  const query = useQuery(key, () => fetchPlease(key))
  return query
}

export const useRecharge = (which, options = {}) => {
  console.log("useRecharge", { which, options })
  const key = qs.stringify({ which, ...options })
  const fetch = () => fetcher[which](options)
  const query = useQuery(key, fetch, { retry: shouldRetry })
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
