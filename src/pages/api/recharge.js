import Recharge from "recharge-api-node"
import mongojs from "mongojs"
import jwt from "next-auth/jwt"

const { MONGO_URL } = process.env
export const mongo = mongojs(MONGO_URL)
const users = mongo.collection("users")

const getRecharge = (apiKey) => {
  return new Recharge({
    apiKey: apiKey,
    secrete: "pnf-recharge-nextjs",
  })
}

const getUserRechargeKey = (emailAddress) => {
  return new Promise((resolve, reject) => {
    users.findOne({ emailAddress }, (err, doc) => {
      err && console.log("mongo err", { err })
      err && reject(err)
      return resolve(doc.rechargeApiKey)
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

async function count(req, res, query, recharge) {
  const { dataType } = req.query
  const count = await recharge[dataType].count()
  return res.json(count)
}

async function listAll(req, res, query, recharge) {
  const { dataType } = req.query
  const count = await recharge[dataType].count()
  const pageCount = Math.ceil(count / 250)
  const iterable = Array(pageCount).fill([recharge[dataType]])
  const promises = iterable.map(getPage)
  const pages = await Promise.all(promises)
  const items = pages.flat()
  console.log(dataType, items.length)
  return res.json(items)
}

async function get(req, res, query, recharge) {
  const { dataType, arg, ...params } = query
  console.log("GET", { dataType, arg, params })
  const data = await recharge[dataType].get(arg, params)
  return res.json(data)
}

async function list(req, res, query, recharge) {
  const { dataType, arg, ...params } = query
  const args = arg ? [arg, params] : [params]
  const data = await recharge[dataType].list(...args)
  return res.json(data)
}

const replaceCode = async (req, res, query, recharge) => {
  const { addressId, newCode, currentCode } = query
  const existingCode = currentCode === "undefined" ? undefined : currentCode
  const needsReplaced = addressId && newCode && existingCode
  const needsAdded = addressId && newCode && !existingCode
  console.log({ addressId, newCode, currentCode, existingCode, needsAdded, needsReplaced })

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

const diagnostics = async (req, res, query, recharge) => {
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

const methods = {
  replaceCode,
  diagnostics,
  listAll,
  count,
  list,
  get,
}

export default async (req, res) => {
  const secret = process.env.JWT_SECRET
  const token = await jwt.getToken({ req, secret })
  const email = token ? token.email : "colshacol@gmail.com"
  const rechargeKey = await getUserRechargeKey(email)
  const recharge = getRecharge(rechargeKey)
  console.log({ token, secret, rechargeKey })

  const { method, ...query } = req.query
  return methods[method](req, res, query, recharge)
}
