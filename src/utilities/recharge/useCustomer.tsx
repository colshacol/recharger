import { queryCache } from "../reactQuery"
import { useRecharge, useRechargeMutation } from "./"

export function useCustomer(id, options = {}) {
  const invalidateKeys = [
    `customer-${id}`,
    `customer-${id}-addresses`,
    `customer-${id}-subscriptions`,
    `all-discounts`,
  ]

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
    key: `allDiscounts`,
    dataType: "discount",
    method: "listAll",
  })

  const replaceCode = useRechargeMutation({
    method: "replaceCode",
  })

  const fixCode = {
    status: replaceCode[1].status,
    data: replaceCode[1].data,
    error: replaceCode[1].error,
    mutate: async (args) => {
      const data = await replaceCode[0](args)
      invalidateKeys.map((key) => queryCache.invalidateQueries(key))
    },
  }

  const isReady =
    subscriptions.status === "success" &&
    discounts.status === "success" &&
    customer.status === "success" &&
    addresses.status === "success"

  return { fixCode, subscriptions, discounts, customer, addresses, isReady }
}
