// import qs from "query-string"
import dayjs from "dayjs"
import isEmpty from "is-empty"
import queryString from "query-string"
import store from "store"
import { wretch } from "../wretch"

const BASE_URL = `/api/recharge`
const rechargeApi = wretch(BASE_URL)

type QueryT = {
  method: string
  dataType: string
  key?: string
  [key: string]: any
}

const isListAll = (query) => {
  const { dataType, method, ...others } = query
  const isOthersEmpty = isEmpty(others)
  const isListAll = method === "listAll"
  return isListAll && isOthersEmpty
}

// For retrieving existing items in Recharge.
export const get = async (query: QueryT) => {
  console.log("get", query.dataType, query)

  const { method, dataType, ...otherParams } = query
  const params = queryString.stringify(otherParams)
  const storageKey = `${method}:${dataType}_${params}`
  const storageValue = store.get(storageKey)

  if (storageValue) {
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

  return rechargeApi.query(query).get().fetchError(onFetchError).json().then(handleSuccess)
}

// For creating new items in Recharge.
export const post = async (query: QueryT) => {
  console.log("post", query.dataType, query)

  const onFetchError = (error) => {
    console.log("error", error.text)
    return error
  }

  return rechargeApi.query(query).get().fetchError(onFetchError).json()
}

export const fetcher = {
  get,
  post,
}
