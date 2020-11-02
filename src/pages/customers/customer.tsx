import * as React from "react"
import { css } from "@emotion/core"
import Avatar from "@atlaskit/avatar"
import Button from "@atlaskit/button"
import EmailIcon from "@atlaskit/icon/glyph/email"
import PhoneIcon from "@atlaskit/icon/glyph/hipchat/dial-out"
import Lozenge from "@atlaskit/lozenge"
import Spinner from "@atlaskit/spinner"
import { Checkbox } from "@atlaskit/checkbox"

import { Toggle } from "../../comps/Toggle"

import { colors } from "@atlaskit/theme"
import Textfield from "@atlaskit/textfield"

import dayjs from "dayjs"
import { useRouter } from "next/router"
import * as Grid from "../../comps/Grid"
import { Layout } from "../../comps/Layout"
import { Spacer } from "../../comps/Spacer"
import { Text } from "../../comps/Text"
import { useRecharge } from "../../utilities/recharge"
import * as $recharge from "../../utilities/recharge/utilites"
import { useImmer } from "use-immer"
import { useToggle } from "../../utilities/useToggle"
import { useEffect } from "react"
import { firstPass } from "../../utilities/firstPass"
import { useStringifiedObjectSearch } from "../../utilities/useStringifiedObjectSearch"
import { useCustomer } from "../../utilities/recharge/useCustomer"
import { ListSection } from "../../comps/ListSection"
import { SectionMessage } from "../../comps/SectionMessage"

type CustomerPropsT = {}

export default function Customer(props) {
  const router = useRouter()
  const { id } = router.query
  return id ? <CustomerPage id={id} path={router.asPath} /> : <Spinner size='xlarge' />
}

const checkDiscountMismatch = (subscriptions, addresses, discounts) => {
  const [discountId] = $recharge.getDiscountIds(addresses)
  const [discountCode] = $recharge.getDiscountCodes(discounts, [discountId])
  const productCount = $recharge.countProducts(subscriptions)
  const expectedCode = productCount < 2 ? undefined : `BOX-OF-${productCount}`

  return {
    isMismatch: discountCode !== expectedCode,
    isSimilar: discountCode?.includes(expectedCode),
    expectedCode,
    discountCode,
  }
}

const sectionMessageContainerCss = css`
  > section {
    width: 100%;
  }
`

const CustomerPage = (props) => {
  const data = useCustomer(props.id)
  const customer = data.customer.data || {}
  const subscriptions = data.subscriptions.data || []
  const addresses = data.addresses.data || []
  const discounts = data.discounts.data || []
  const [isLoading, setIsLoading] = React.useState(true)

  const isLoadingList = [
    data.customer.isLoading,
    data.subscriptions.isLoading,
    data.addresses.isLoading,
    data.discounts.isLoading,
  ]

  React.useEffect(() => {
    console.log({ isLoadingList })
    if (!isLoadingList.filter(Boolean).length) {
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }, isLoadingList)

  const discountMismatch = checkDiscountMismatch(subscriptions, addresses, discounts)
  const isTotalMismatch = discountMismatch.isMismatch && !discountMismatch.isSimilar
  const isSimilarMismatch = discountMismatch.isMismatch && discountMismatch.isSimilar
  const isNotMismatch = !discountMismatch.isMismatch

  const totalMismatchActions = [
    {
      key: "fix",
      text: "Fix Now",
      onClick() {
        console.log("FIXING")
      },
    },
  ]

  const similarMismatchActions = [
    {
      key: "fix",
      text: "Fix Now",
      onClick() {
        console.log("FIXING")
      },
    },
  ]

  const totalMismatchMessage = data.isReady && isTotalMismatch && (
    <SectionMessage title='Discount code mismatch.' appearance='error' actions={totalMismatchActions}>
      <p>
        <span style={{ width: "100%" }}>
          We expected to see a discount code of {discountMismatch.expectedCode}
        </span>
        <span style={{ width: "100%" }}> but found {discountMismatch.discountCode} instead.</span>
      </p>
    </SectionMessage>
  )

  const similarMismatchMessage = data.isReady && isSimilarMismatch && (
    <SectionMessage
      title='Promotional discount code applied.'
      appearance='warning'
      actions={similarMismatchActions}
      children=''
    />
  )

  const noMismatchMessage = data.isReady && isNotMismatch && (
    <SectionMessage title='The discount codes seem to match up.' appearance='info'>
      <p>All good! The discount codes associated with this customer and their addresses seem to be correct.</p>
    </SectionMessage>
  )

  return (
    <Layout title={`Customer (${props.id})`} crumbText='Customer' crumbRouteTo={props.path}>
      <Grid.Container>
        <Grid.Row>
          <CustomerCard customer={customer} />
        </Grid.Row>
      </Grid.Container>

      {totalMismatchMessage}
      {similarMismatchMessage}
      {noMismatchMessage}

      <Spacer size='24px' />
      <SubscriptionsSection isLoading={isLoading} subscriptions={subscriptions} />
      <Spacer size='24px' />
      <AddressesSection isLoading={isLoading} addresses={addresses} discounts={discounts} />
    </Layout>
  )
}

const SubscriptionsSection = (props) => {
  const { subscriptions } = props
  const showActive = useToggle(true)
  const showCanceled = useToggle(true)
  const searchFilter = useStringifiedObjectSearch(subscriptions)
  const showAllStatuses = showActive.value && showCanceled.value

  const resetFilters = () => {
    showActive.setTrue()
    showCanceled.setTrue()
    searchFilter.setValue("")
  }

  const itemsToShow = firstPass([
    [() => showAllStatuses, searchFilter.filteredItems],
    [
      () => !showCanceled.value && showActive.value,
      () => $recharge.getActiveSubscriptions(searchFilter.filteredItems),
    ],
    [
      () => !showActive.value && showCanceled.value,
      () => $recharge.getCanceledSubscriptions(searchFilter.filteredItems),
    ],
    [() => true, []],
  ])

  const filters = (
    <>
      <Checkbox
        // value=""
        label='Show Active'
        isChecked={showActive.value}
        onChange={showActive.toggle}
        id='only-show-active-subscriptions'
        name='only-show-active-subscriptions'
        // testid='only-show-active-subscriptions'
      />
      <Spacer size='24px' />

      <Checkbox
        // value=""
        isChecked={showCanceled.value}
        // defaultChecked
        label='Show Canceled'
        onChange={showCanceled.toggle}
        id='only-show-canceled-subscriptions'
        name='only-show-canceled-subscriptions'
        // testid='only-show-canceled-subscriptions'
      />
      <Spacer size='24px' />
      <Grid.Column>
        <Textfield
          isCompact
          width={200}
          name='subscriptionSearch'
          placeholder='search'
          value={searchFilter.value}
          onChange={searchFilter.setValue}
        />
      </Grid.Column>
    </>
  )

  return (
    <ListSection
      isLoading={props.isLoading}
      title={`Subscriptions (${subscriptions.length})`}
      subTitle={`Total Quantity: (${$recharge.countProducts(subscriptions)})`}
      resetFilters={resetFilters}
      filters={filters}
      items={itemsToShow}
    >
      {(item) => (
        <>
          <Grid.Row>
            <Lozenge appearance={item.status === "ACTIVE" ? "success" : "removed"}>{item.status}</Lozenge>
            <Spacer size='8px' />
            <Text is='small'>({item.id})</Text>
          </Grid.Row>
          <Spacer size='8px' />
          <Text is='h4'>{item.product_title}</Text>
          <Spacer size='8px' style={{ marginTop: "auto" }} />
          <Text is='p'>Quantity: {item.quantity}</Text>
          <Spacer size='8px' />
          <Text is='h5'>Next Charge: {dayjs(item.next_charge_scheduled_at).format("MM/DD/YYYY")}</Text>
        </>
      )}
    </ListSection>
  )
}

const AddressesSection = (props) => {
  const { addresses, discounts } = props
  const title = `Addresses (${addresses.length})`
  return (
    <ListSection title={title} items={addresses} isLoading={props.isLoading}>
      {(address) => (
        <>
          <Text is='small'>({address.id})</Text>
          <Spacer size='2px' />
          <Text is='h4'>
            {address.first_name} {address.last_name}
          </Text>
          <Spacer size='8px' />
          <Text is='h5'>{address.address1}</Text>
          {address.address2 && <Text is='h5'>{address.address2}</Text>}
          <Spacer size='8px' />
          <Text is='h5'>
            {address.city}, {address.province}
          </Text>
          <Spacer size='8px' />
          <Text is='h5'>{address.zip}</Text>
          <Spacer size='8px' />
          {/* <Text is='h5'>{address.country}</Text> */}
          <Spacer size='8px' style={{ marginTop: "auto" }} />
          <Text is='p'>Discount:</Text>
          <Text is='h5'>{$recharge.getDiscountCode(discounts, address.discount_id) || "N/A"}</Text>
        </>
      )}
    </ListSection>
  )
}

const CustomerCard = ({ customer }) => {
  return (
    <Grid.Row alignItems='flex-start'>
      <Grid.Row width='70%'>
        <Avatar size='xlarge' />
        <Spacer size='8px' />
        <Grid.Column paddingY='8px' alignItems='flex-start'>
          <Grid.Row alignItems='flex-end'>
            <Text is='h3'>
              {customer.first_name} {customer.last_name}
            </Text>
            <Spacer size='8px' />
            <Lozenge appearance='success'>{customer.status}</Lozenge>
            {/* <Text is='p'>{customer.billing_phone}</Text> */}
          </Grid.Row>
          <Spacer size='8px' />
          <Grid.Column>
            <Grid.Row>
              <PhoneIcon label='phone' />
              <Spacer size='2px' />
              <Text is='p'>{customer.billing_phone || "N/A"}</Text>
            </Grid.Row>
            <Spacer size='2px' />
            <Grid.Row>
              <EmailIcon label='email' />
              <Spacer size='4px' />
              <Text is='p'>{customer.email || "N/A"}</Text>
            </Grid.Row>
          </Grid.Column>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row width='30%' justifyContent='flex-end'>
        <Button>Save</Button>
      </Grid.Row>
    </Grid.Row>
  )
}
