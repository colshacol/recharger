import Recharge from "recharge-api-node"
import isEmpty from "is-empty"

const recharge = new Recharge({
  apiKey: process.env.RECHARGE_API_KEY,
  secrete: "pnf-recharge-nextjs",
})

export default async (req, res) => {
  console.log("\n🦇🖤👻[api/v0/getProducts]", req.query, "\n")

  if (req.query.ids) {
    const ids = req.query.ids.split("-")
    const promises = ids.map((id) => recharge.product.get(id))
    const products = await Promise.all(promises)
    return res.json(products)
  }

  if (req.query.id) {
    const product = await recharge.product.get(id)
    return res.json(product)
  }

  const products = await recharge.product.list()
  res.json(products)
}
