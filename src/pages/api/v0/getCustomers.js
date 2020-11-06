import Recharge from "recharge-api-node"
import isEmpty from "is-empty"

const recharge = new Recharge({
  apiKey: process.env.RECHARGE_API_KEY,
  secrete: "pnf-recharge-nextjs",
})

async function getPage([api, query = {}], index) {
  const page = typeof index === "number" ? index + 1 : 1
  return api.list({ limit: 250, page, ...query })
}

const getAllPages = async (recharge) => {
  const count = await recharge.customer.count()
  const pageCount = Math.ceil(count / 250)
  const iterable = Array(pageCount).fill([recharge.customer])
  const promises = iterable.map(getPage)
  const pages = await Promise.all(promises)
  const items = pages.flat()
  console.log("customer count: ", items.length)
  return items
}

export default async (req, res) => {
  console.log("\n🦇🖤👻[api/v0/getCustomers]")
  const customers = await getAllPages(recharge)
  res.json(customers)
}
