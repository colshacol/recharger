import Recharge from "recharge-api-node"
import isEmpty from "is-empty"

const recharge = new Recharge({
  apiKey: process.env.RECHARGE_API_KEY,
  secrete: "pnf-recharge-nextjs",
})

function countItems(pages) {
  return pages.reduce((final, list) => {
    return final + list.length
  }, 0)
}

async function getPage([api, query = {}], index) {
  const page = typeof index === "number" ? index + 1 : 1
  return api.list({ limit: 250, page, ...query })
}

async function listAll(req, res) {
  const { dataType } = req.query
  const count = await recharge[dataType].count()
  const pageCount = Math.ceil(count / 250)
  console.log({ dataType, count, pageCount })
  const iterable = Array(pageCount).fill([recharge[dataType]])
  const promises = iterable.map(getPage)
  const pages = await Promise.all(promises)
  const finalCount = countItems(pages)
  const items = pages.flat()
  res.json(items)
}

async function get(req, res, query) {
  const { dataType, arg, ...params } = query
  console.log("GET", { dataType, arg, params })
  const data = await recharge[dataType].get(arg, params)
  return res.json(data)
}

async function list(req, res, query) {
  const { dataType, arg, ...params } = query
  console.log("LIST", { dataType, arg, params })
  const args = arg ? [arg, params] : [params]
  const data = await recharge[dataType].list(...args)

  res.json(data)
}

const methods = {
  listAll,
  list,
  get,
}

export default async (req, res) => {
  const { method, ...query } = req.query
  return methods[method](req, res, query)
}
