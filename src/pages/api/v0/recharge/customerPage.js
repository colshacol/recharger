import { getCustomerPage } from "../../../../utilities/fetcher"

export default async (req, res) => {
  console.log("\n🦇🖤👻[api/v0/getCustomerPage]", req.query)
  const { id } = req.query
  const customer = await getCustomerPage({ id })
  res.json(customer)
}
