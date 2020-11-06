import { wretch } from "./wretch"

const api = wretch.url(process.env.RECHARGE_API_URL)

export const get = async (query) => {
  console.log("fetcher.get:method", query.method)
  console.log("fetcher.get:dataType", query.dataType)

  const onError = (error) => {
    console.log("fetcher.get error", error.text)
    return error
  }

  return api
    .query(query)
    .options({ headers: { Accept: "application/json", "Content-Type": "application/json" } })
    .get()
    .fetchError(onError)
    .json()
}

export const getAll = (dataType) => {
  return () => {
    return get({
      method: "listAll",
      dataType,
    })
  }
}

export const getById = (dataType) => {
  return ({ id }) => {
    return get({
      method: "get",
      dataType,
      arg: id,
    })
  }
}

export const getAllWhere = (dataType) => {
  return (query) => {
    return get({
      method: "list",
      dataType,
      ...query,
    })
  }
}

export const getAllCustomers = getAll("customer")
export const getAllDiscounts = getAll("discount")
export const getAllAddresses = getAll("address")
export const getAllSubscriptions = getAll("subscription")

export const getCustomer = getById("customer")
export const getDiscount = getById("discount")
export const getAddresse = getById("address")
export const getSubscription = getById("subscription")

export const getCustomersWhere = getAllWhere("customer")
export const getDiscountsWhere = getAllWhere("discount")
export const getAddressesWhere = getAllWhere("address")
export const getSubscriptionsWhere = getAllWhere("subscription")

export const getCustomerAddresses = ({ id }) => {
  return getAddressesWhere({ customer_id: id })
}

export const getAddressSubscriptions = ({ id }) => {
  return getSubscriptionsWhere({ address_id: id })
}

export const getCustomerPage = async ({ id }) => {
  const customer = await getCustomer({ id })

  customer.addresses = await fetcher.get({
    dataType: "customerAddress",
    method: "list",
    arg: id,
  })

  console.log("customer.addresses", customer.addresses)

  for (const address of customer.addresses) {
    const { discount_id, id } = address

    if (discount_id) {
      const { code } = await getDiscount({ id: discount_id })
      console.log("address.code", code)
      address.discount_code = code
    }

    address.subscriptions = await getAddressSubscriptions({ id })
    console.log("customer.subscriptions", address.subscriptions)
  }

  return customer
}

const getCustomerPageData = ({ id }) => {
  return wretch.url("/api/v0/recharge/customerPage").query({ id }).get().json()
}

export const fetcher = {
  get,
  getAllCustomers,
  getAllDiscounts,
  getAllAddresses,
  getAllSubscriptions,
  getCustomer,
  getDiscount,
  getAddresse,
  getSubscription,
  getCustomersWhere,
  getDiscountsWhere,
  getAddressesWhere,
  getSubscriptionsWhere,
  getCustomerAddresses,
  getAddressSubscriptions,
  getCustomerPage,
  getCustomerPageData,
}
