import { queryCache } from "../reactQuery"
import { useRecharge, useRechargeMutation } from "."

export const useAllDiscounts = () => {
  return useRecharge({
    key: "allDiscounts",
    dataType: "discount",
    method: "listAll",
  })
}

export const useAllCustomers = () => {
  return useRecharge({
    key: "allCustomers",
    dataType: "customer",
    method: "listAll",
  })
}

export const useAllSubscriptions = () => {
  return useRecharge({
    key: "allSubscriptions",
    dataType: "subscription",
    method: "listAll",
  })
}

export const useAllAddresses = () => {
  return useRecharge({
    key: "allAddresses",
    dataType: "address",
    method: "listAll",
  })
}

const useAll = {
  discount: useAllDiscounts,
  customer: useAllCustomers,
  subscription: useAllSubscriptions,
  address: useAllAddresses,
}

export const useOneById = (dataType, id) => {
  const query = useAll[dataType]()
  const item = query.data?.find((item) => item.id === id)
  return { ...query, item }
}

export const useMultipleByFilter = (dataType, filter) => {
  const query = useAll[dataType]()
  const items = query.data?.filter(filter)
  return { ...query, items }
}

export const useDiscount = (id) => {
  return useOneById("discount", id)
}

export const useSubscription = (id) => {
  return useOneById("subscription", id)
}

export const useAddress = (id) => {
  return useOneById("address", id)
}

export const useCustomer = (id) => {
  return useOneById("customer", id)
}

export const useAddressesWithDiscountId = (id) => {
  return useMultipleByFilter("address", (item) => {
    return item.discount_id === id
  })
}

export const useSubscriptionsWithCustomerId = (id) => {
  return useMultipleByFilter("address", (item) => {
    return item.customer_id === id
  })
}
