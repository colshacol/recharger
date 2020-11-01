// import qs from "query-string"
import dayjs from "dayjs"
import isEmpty from "is-empty"
import { getType } from "is-what"
import store from "store"
import expirePlugin from "store/plugins/expire"

store.addPlugin(expirePlugin)

const setExpirations = (data) => {
  store.set("$$expirations", data)
}

const getExpirations = () => {
  return store.get("$$expirations")
}

const getExpiration = (key) => {
  const expirations = getExpirations()
  const isDefaulted = !expirations[key]
  const timeout = expirations[key] || dayjs().add(5, "minute")
  const expiration = calculateExpiration(timeout)
  return [expiration, timeout, isDefaulted]
}

const calculateExpiration = (timeout) => {
  return dayjs().add(timeout, "minute")
}

const updateKey = (key, handler) => {
  const oldData = store.get(key)
  const newData = handler(oldData)
  const [expiration] = getExpiration(key)
  store.set(key, newData, expiration)
}

const set = (key, value) => {
  const [expiration] = getExpiration(key)
  store.set(key, value, expiration)
}

const get = (key, defaultValue = null) => {
  const [expiration] = getExpiration(key)
  const data = store.get(key) || defaultValue
  return [data, expiration]
}

export const storage = {
  set,
  get,
  remove: store.remove,
  clearAll: store.clearAll,
  updateKey,
}
