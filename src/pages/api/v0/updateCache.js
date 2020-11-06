import Recharge from "recharge-api-node"
import monk from "monk"
import jwt from "next-auth/jwt"
import isEmpty from "is-empty"

import { listAll } from "#utilities/server/recharge"

const { MONGO_CACHE_URL } = process.env
export const mongo = monk(MONGO_CACHE_URL)

const recharge = new Recharge({
  apiKey: process.env.RECHARGE_API_KEY,
  secrete: "pnf-recharge-nextjs",
})

mongo.get("addresss").drop()

export default async function (req, res) {
  console.log("\n🦇🖤👻[api/v0/updateCache]\n")
  const allOrders = await listAll(recharge.order)
  await mongo.get("orders").drop()
  await mongo.get("orders").insert(allOrders)
  const allCustomers = await listAll(recharge.customer)
  await mongo.get("customers").drop()
  await mongo.get("customers").insert(allCustomers)
  const allProducts = await listAll(recharge.product)
  await mongo.get("products").drop()
  await mongo.get("products").insert(allProducts)
  const allAddresses = await listAll(recharge.address)
  await mongo.get("addresses").drop()
  await mongo.get("addresses").insert(allAddresses)
  const allSubscriptions = await listAll(recharge.subscription)
  await mongo.get("subscriptions").drop()
  await mongo.get("subscriptions").insert(allSubscriptions)
  console.log("\n🦇🖤👻[api/v0/updateCache] DONE\n")
  return res.json({ isSuccess: true })
}
