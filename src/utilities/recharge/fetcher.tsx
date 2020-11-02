// import qs from "query-string"
import dayjs from "dayjs"
import isEmpty from "is-empty"
import queryString from "query-string"
import store from "store"
import { wretch } from "../wretch"
import cookies from "js-cookie"

const BASE_URL = `/api/recharge`
const rechargeApi = () => wretch(BASE_URL).auth(`Bearer ${cookies.get("next-auth.session-token")}`)

type QueryT = {
  method: string
  dataType?: string
  key?: string
  [key: string]: any
}

// For retrieving existing items in Recharge.
export const get = async (query: QueryT) => {
  console.log("fetcher.get", query.dataType, query.method)
  const { method, dataType, ...otherParams } = query
  const params = queryString.stringify(otherParams)
  const storageKey = `${method}:${dataType}_${params}`
  const storageValue = store.get(storageKey)

  if (query.dataType && query.method === "listAll" && storageValue) {
    console.log("fetcher.get", "returning storage value for", storageKey)
    return storageValue
  }

  const onFetchError = (error) => {
    console.log("error", error.text)
    return error
  }

  const handleSuccess = (json) => {
    store.set(storageKey, json)
    return json
  }

  return rechargeApi().query(query).get().fetchError(onFetchError).json().then(handleSuccess)
}

// For creating new items in Recharge.
export const post = async (query: QueryT) => {
  console.log("post", query.dataType, query)

  const onFetchError = (error) => {
    console.log("error", error.text)
    return error
  }

  return rechargeApi().query(query).get().fetchError(onFetchError).json()
}

export const fetcher = {
  get,
  post,
}
