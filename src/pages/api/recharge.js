import { parseCookies, setCookie, destroyCookie } from "nookies"
import Recharge from "recharge-api-node"
import isEmpty from "is-empty"
import mongojs from "mongojs"
import jwt from "next-auth/jwt"

const { MONGO_URL } = process.env
export const mongo = mongojs(MONGO_URL)
const users = mongo.collection("users")

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
  res.json(count)
}

async function listAll(req, res, query, recharge) {
  const { dataType } = req.query
  const count = await recharge[dataType].count()
  const pageCount = Math.ceil(count / 250)
  const iterable = Array(pageCount).fill([recharge[dataType]])
  const promises = iterable.map(getPage)
  const pages = await Promise.all(promises)
  const finalCount = countItems(pages)
  const items = pages.flat()
  res.json(items)
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
  res.json(data)
}

const methods = {
  listAll,
  count,
  list,
  get,
}

const getRecharge = (apiKey) => {
  return new Recharge({
    apiKey: apiKey,
    secrete: "pnf-recharge-nextjs",
  })
}

const getUserRechargeKey = (emailAddress) => {
  return new Promise((resolve, reject) => {
    users.findOne({ emailAddress }, (err, doc) => {
      console.log({ doc })
      err && console.log({ err })
      err && reject(err)
      return resolve(doc.rechargeApiKey)
    })
  })
}

export default async (req, res) => {
  const secret = process.env.JWT_SECRET
  const token = await jwt.getToken({ req, secret })
  const rechargeKey = await getUserRechargeKey(token.email)
  console.log({ email, rechargeKey })
  const recharge = getRecharge(rechargeKey)

  const { method, ...query } = req.query
  return methods[method](req, res, query, recharge)
}
