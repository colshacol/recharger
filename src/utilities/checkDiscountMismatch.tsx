import * as $recharge from "./recharge/utilites"

export const getDiscountMismatch = (subscriptions, addresses, discounts) => {
  const [discountId] = $recharge.getDiscountIds(addresses)
  const [discountCode] = $recharge.getDiscountCodes(discounts, [discountId])
  const productCount = $recharge.countProducts(subscriptions.filter((item) => item.status === "ACTIVE"))
  const expectedCode = productCount < 2 ? undefined : `BOXOF${productCount}`
  const altExpected = productCount < 2 ? undefined : `BOX-OF-${productCount}`

  return {
    isMismatch: discountCode !== expectedCode,
    isSimilar: discountCode?.includes(expectedCode) || discountCode?.includes(altExpected),
    expectedCode,
    discountCode,
  }
}
