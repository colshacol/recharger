import { useEffect, useState } from "react"

import { Spinner } from "./Atlaskit"
import sift from "sift"
import store from "store"
import didYouMean from "didyoumean2"
import { fetcher } from "../utilities/recharge/fetcher"
import { createContextHook } from "@kensie/create-context-hook"
import { Grid } from "./Grid"
import { Text } from "./Text"
import { Spacer } from "./Spacer"

import {
  useAllAddresses,
  useAllCustomers,
  useAllDiscounts,
  useAllSubscriptions,
} from "../utilities/recharge/hooks"

export const [_DiagnosticsProvider, useDiagnostics] = createContextHook(() => {
  const subscriptions = useAllSubscriptions()
  const discounts = useAllDiscounts()
  const customers = useAllCustomers()
  const addresses = useAllAddresses()

  const isReady =
    subscriptions.status === "success" &&
    discounts.status === "success" &&
    customers.status === "success" &&
    addresses.status === "success"

  const data = getDiagnostics({
    subscriptions: subscriptions.data,
    discounts: discounts.data,
    customers: customers.data,
    addresses: addresses.data,
  })

  return {
    data,
    isReady,
    subscriptions,
    discounts,
    customers,
    addresses,
  }
})

export const DiagnosticsProvider = (props) => {
  return (
    <_DiagnosticsProvider>
      <DiagnosticsInnerProvider>{props.children}</DiagnosticsInnerProvider>
    </_DiagnosticsProvider>
  )
}

const DiagnosticsInnerProvider = (props) => {
  const diagnostics = useDiagnostics()

  if (!diagnostics.isReady) {
    return (
      <Grid.Container alignItems='center' justifyContent='center' height='100vh'>
        <Spinner size='xlarge' />
        <Spacer size='48px' />
        <Text is='h1'>Running diagnostics...</Text>
      </Grid.Container>
    )
  }

  return props.children
}

const NORMAL_CODES = Object.keys(Array(20).fill("")).map((index) => {
  return `BOXOF${Number(index) + 2}`
})

const getDiagnostics = (allData) => {
  if (Object.values(allData).filter(Boolean).length < 4) return
  const getClosestCode = (input) => didYouMean(input, NORMAL_CODES)

  const matchDataId = (id) => sift({ id })
  const matchCustomerId = (customer_id) => sift({ customer_id })
  const matchStatus = (status) => sift({ status })

  const isActive = matchStatus("ACTIVE")
  const isCancelled = matchStatus("CANCELLED")

  for (const customer of allData.customers) {
    const discountCodes = []
    const matchCustomer = matchCustomerId(customer.id)
    const addresses = allData.addresses.filter(matchCustomer)
    const subscriptions = allData.subscriptions.filter(matchCustomer)
    const activeSubscriptionCount = subscriptions.filter(isActive).length
    const canceledSubscriptionCount = subscriptions.filter(isCancelled).length
    customer.addresses = addresses
    customer.discountCodes = discountCodes
    customer.subscriptions = subscriptions
    customer.activeSubscriptionCount = activeSubscriptionCount
    customer.canceledSubscriptionCount = canceledSubscriptionCount

    for (const address of customer.addresses) {
      const matchDiscount = matchDataId(address.discount_id)
      address.discount_id && (customer.hasDiscounts = true)
      address.discounts = allData.discounts.filter(matchDiscount)
      address.discounts.forEach((item) => customer.discountCodes.push(item.code))

      for (const discount of address.discounts) {
        if (discount.status !== "CANCELLED") {
          console.log({ discount })
          discount.isMismatch = !NORMAL_CODES.includes(discount.code)
          // discount.isMismatch && (discount.suggestedCode = getClosestCode(discount.code))
          discount.isMismatch && (discount.suggestedCode = `BOXOF${customer.activeSubscriptionCount}`)
          discount.isMismatch && (customer.hasMismatchedCodes = true)
        }
      }
    }
  }

  const data = {
    customers: allData.customers,
    multiAddressCustomers: [],
    mismatchDiscountCodes: [],
  }

  for (const customer of allData.customers) {
    if (customer.addresses.length > 1) data.multiAddressCustomers.push(customer.id)
    if (customer.hasMismatchedCodes) data.mismatchDiscountCodes.push(customer.id)
  }

  return data
}
