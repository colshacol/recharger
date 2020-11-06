import Recharge from "recharge-api-node"
import isEmpty from "is-empty"

const recharge = new Recharge({
  apiKey: process.env.RECHARGE_API_KEY,
  secrete: "pnf-recharge-nextjs",
})

export default async (req, res) => {
  console.log("\n🦇🖤👻[api/v0/updateDiscountCode]", req.query, "\n")
  const { addressId, newCode, currentCode } = req.query

  const existingCode = currentCode === "undefined" ? undefined : currentCode
  const needsReplaced = addressId && newCode && existingCode
  const needsAdded = addressId && newCode && !existingCode
  console.log("\n🦇🖤👻", { addressId, newCode, currentCode, existingCode, needsAdded, needsReplaced }, "\n")

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
