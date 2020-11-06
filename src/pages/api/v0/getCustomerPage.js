import Recharge from "recharge-api-node"
import isEmpty from "is-empty"

const recharge = new Recharge({
  apiKey: process.env.RECHARGE_API_KEY,
  secrete: "pnf-recharge-nextjs",
})

export default async (req, res) => {
  console.log("\n🦇🖤👻[api/v0/getCustomerPage]", req.query)
  const { id } = req.query

  const customer = await recharge.customer.get(id)
  customer.addresses = await recharge.customerAddress.list(id)

  for (const address of customer.addresses) {
    const { discount_id, id: address_id } = address

    if (discount_id) {
      const discount = await recharge.discount.get(discount_id)
      address.discount = discount
      address.discount_code = discount.code
    }

    address.subscriptions = await recharge.subscription.list({ address_id })

    for (const subscription of address.subscriptions) {
      const { recharge_product_id } = subscription
      subscription.product = await recharge.product.get(recharge_product_id)
    }
  }

  res.json(customer)
}
