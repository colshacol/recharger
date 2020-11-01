import sift from "sift"

export const getDiscountCode = (discounts = [], id) => {
  const discount = discounts.find(sift({ id }))
  return discount?.code
}

export const getDiscountCodes = (discounts = [], ids = []) => {
  return ids.map((id) => getDiscountCode(discounts, id))
}

export const getDiscountIds = (addresses = []) => {
  return addresses.map(({ discount_id }) => discount_id)
}

export const countProducts = (subscriptions = []) => {
  return subscriptions.reduce((final, sub) => {
    return final + sub.quantity
  }, 0)
}

export const getActiveSubscriptions = (subscriptions = []) => {
  return subscriptions.filter(sift({ status: "ACTIVE" }))
}

export const getCanceledSubscriptions = (subscriptions = []) => {
  return subscriptions.filter(sift({ status: "CANCELLED" }))
}
