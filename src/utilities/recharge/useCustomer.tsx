import { useRecharge } from "./"

export function useCustomer(id, options = {}) {
  const customer = useRecharge({
    key: `customer-${id}`,
    dataType: "customer",
    method: "get",
    arg: id,
  })

  const addresses = useRecharge({
    key: `customer-${id}-addresses`,
    dataType: "customerAddress",
    method: "list",
    arg: id,
  })

  const subscriptions = useRecharge({
    key: `customer-${id}-subscriptions`,
    dataType: "subscription",
    method: "list",
    customer_id: id,
  })

  const discounts = useRecharge({
    key: `all-discounts`,
    dataType: "discount",
    method: "listAll",
  })

  const isReady =
    subscriptions.status === "success" &&
    discounts.status === "success" &&
    customer.status === "success" &&
    addresses.status === "success"

  return { subscriptions, discounts, customer, addresses, isReady }
}
