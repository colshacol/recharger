import Recharge from "recharge-api-node"
import isEmpty from "is-empty"

const recharge = new Recharge({
  apiKey: process.env.RECHARGE_API_KEY,
  secrete: "pnf-recharge-nextjs",
})

export default async (req, res) => {
  console.log("\n🦇🖤👻[api/v0/getOne]", req.query, "\n")

  const item = await recharge[req.query.dataType].get(req.query.id)
  res.json(item)
}
