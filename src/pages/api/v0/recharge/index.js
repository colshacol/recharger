import {
  DATABASE_ERROR,
  AUTHENTICATION_FAILED,
  NO_RECHARGE_API_TOKEN,
  NO_USER_FOUND,
} from "../../../../utilities/server/responses"

import { getUser } from "../../../../utilities/server/mongo"
import { authenticate } from "../../../../utilities/server/authenticate"

import Recharge from "recharge-api-node"
import mongojs from "mongojs"
import jwt from "next-auth/jwt"
import isEmpty from "is-empty"

const { MONGO_URL } = process.env
export const mongo = mongojs(MONGO_URL)
const users = mongo.collection("users")
const secret = process.env.JWT_SECRET
const signingKey = process.env.JWT_SIGNING_KEY

const getRecharge = (apiKey) => {
  return new Recharge({
    apiKey: apiKey,
    secrete: "pnf-recharge-nextjs",
  })
}

const getRechargeToken = (emailAddress) => {
  return new Promise((resolve, reject) => {
    users.findOne({ emailAddress }, (err, doc) => {
      err && console.log("getRechargeToken error", { err })
      err && reject(err)
      !doc && console.log("getRechargeToken NO_USER")
      doc && console.log("getRechargeToken", doc.rechargeApiKey)
      doc ? resolve(doc.rechargeApiKey) : resolve("NO_USER")
    })
  })
}

function countItems(pages) {
  return pages.reduce((final, list) => {
    return final + list.length
  }, 0)
}

async function getPage([api, query = {}], index) {
  const page = typeof index === "number" ? index + 1 : 1
  return api.list({ limit: 250, page, ...query })
}

async function count({ req, res, query, recharge }) {
  const { dataType } = req.query
  const count = await recharge[dataType].count()
  return res.json(count)
}

async function listAll({ req, res, query, recharge }) {
  const { dataType } = req.query
  console.log("LIST_ALL", { dataType })
  const count = await recharge[dataType].count()
  const pageCount = Math.ceil(count / 250)
  const iterable = Array(pageCount).fill([recharge[dataType]])
  const promises = iterable.map(getPage)
  const pages = await Promise.all(promises)
  const items = pages.flat()
  console.log(dataType, items.length)
  return res.json(items)
}

async function get({ req, res, query, recharge }) {
  const { dataType, arg, ...paramsObject } = query
  const params = isEmpty(paramsObject) ? undefined : paramsObject
  console.log("GET", { dataType, arg, params })
  const data = await recharge[dataType].get(arg, params)
  return res.json(data)
}

async function list({ req, res, query, recharge }) {
  const { dataType, arg, ...params } = query
  console.log("LIST", { dataType, arg, params })
  const args = arg ? [arg, params] : [params]
  const data = await recharge[dataType].list(...args)
  return res.json(data)
}

const replaceCode = async ({ req, res, query, recharge }) => {
  const { addressId, newCode, currentCode } = query
  const existingCode = currentCode === "undefined" ? undefined : currentCode
  const needsReplaced = addressId && newCode && existingCode
  const needsAdded = addressId && newCode && !existingCode
  console.log("replaceCode", { addressId, newCode, currentCode, existingCode, needsAdded, needsReplaced })

  if (needsReplaced) {
    try {
      const result0 = await recharge.address.removeDiscount(addressId)
      console.log({ result0 })
      const result1 = await recharge.discount.addToAddress(addressId, { discount_code: newCode })
      console.log({ result1 })
      return res.json({ result0, result1 })
    } catch (error) {
      console.log("0", { error })
      return res.json(error)
    }
  }

  if (needsAdded) {
    try {
      const result1 = await recharge.discount.addToAddress(addressId, { discount_code: newCode })
      console.log({ result1 })
      return res.json({ result1 })
    } catch (error) {
      console.error("1", { error })
      return res.json({ error })
    }
  }

  return res.json({ addressId, newCode, message: "missing value" })
}

const mockRes = {
  json: (data) => data,
}

const mockReq = (dataType) => {
  return { query: { dataType } }
}

const diagnostics = async ({ req, res, query, recharge }) => {
  console.log("DIAGNOSTICS")
  const lister = (dataType) => listAll(mockReq(dataType), mockRes, query, recharge)
  const _subscriptions = lister("subscription")
  const _customers = lister("customer")
  const _discounts = lister("discount")
  const _addresses = lister("address")
  const list = await Promise.all([_subscriptions, _customers, _discounts, _addresses])
  const [subscriptions, customers, discounts, addresses] = list
  console.log(subscriptions.length, customers.length, discounts.length, addresses.length)
  res.json({ subscriptions, customers, discounts, addresses })
}

const token = async ({ req, res, query, email, rechargeApiToken }) => {
  if (query.action === "get") {
    return res.json({ token: rechargeApiToken })
  }

  if (query.action === "update") {
    return new Promise((resolve, reject) => {
      users.findAndModify(
        { query: { emailAddress: email }, update: { token: rechargeApiToken } },
        (err, doc) => {
          err && console.log("mongo err", { err })
          err && res.status(400).json(err)
          console.log("token save success")
          resolve(res.json({ success: true }))
        }
      )
    })
  }
}

const newUser = async ({ req, res, query }) => {
  return new Promise((resolve, reject) => {
    users.save(query, (err, doc) => {
      err && console.log("mongo err", { err })
      err && res.status(400).json(err)
      resolve(res.json({ success: true, method: "newUser" }))
    })
  })
}

const methods = {
  replaceCode,
  diagnostics,
  newUser,
  listAll,
  token,
  count,
  list,
  get,
}

export default async (req, res) => {
  const { method, ...query } = req.query

  const token = await authenticate(req)
  console.log("token", token)
  if (!token) return res.status(400).json(AUTHENTICATION_FAILED)

  const user = await getUser(token.email)
  if (!user || !user.rechargeApiToken) return res.status(400).json(NO_RECHARGE_API_TOKEN)
  if (user.error === "NO_USER") return res.status(400).json(NO_USER_FOUND)
  if (user.error) return res.status(400).json(DATABASE_ERROR)

  return methods[method]({
    recharge: getRecharge(user.rechargeApiToken),
    rechargeApiToken: user.rechargeApiToken,
    query,
    email,
    req,
    res,
  })
}
