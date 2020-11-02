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

// next-auth.csrf-token=c453f32fe65993b512f9fb5630f96df68397555d1164ec5cc4ac643250d9ac68%7Cf62ba358787616f72d8bd10f5b7592b15e20b4d29dde617cc77f9f4310ba3234; next-auth.callback-url=http%3A%2F%2Flocalhost%3A3000%2Fhome; next-auth.session-token=eyJhbGciOiJIUzUxMiJ9.eyJuYW1lIjoiY29sc2hhY29sIiwiZW1haWwiOiJjb2xzaGFjb2xAZ21haWwuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyLzIxNzgzN2RiMzkxNDBkMDU2YzE0ZmMzOWIyZTI0NjM0P3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGY28ucG5nIiwiaWF0IjoxNjA0MjgwMjQwLCJleHAiOjE2MDY4NzIyNDB9.QjQ7KxN7uAg6LeRENAJT1j0-ejAFUXUSKnBGdhC5k6TJOMgLqScnG5Oi4rp1HTkmIX_5EzfSBJ2YhtYUYHtTMw
