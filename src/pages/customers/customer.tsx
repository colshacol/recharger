import { Checkbox } from "@atlaskit/checkbox"
import Lozenge from "@atlaskit/lozenge"
import Spinner from "@atlaskit/spinner"
import Textfield from "@atlaskit/textfield"
import { css } from "@emotion/core"
import dayjs from "dayjs"
import { useRouter } from "next/router"
import * as React from "react"
import { CustomerCard } from "../../comps/CustomerCard"
import { useDiagnostics } from "../../comps/DiagnosticsWrapper"
import * as Grid from "../../comps/Grid"
import { Layout } from "../../comps/Layout"
import { ListSection } from "../../comps/ListSection"
import { SectionMessage } from "../../comps/SectionMessage"
import { Spacer } from "../../comps/Spacer"
import { Text } from "../../comps/Text"
import { getDiscountMismatch } from "../../utilities/checkDiscountMismatch"
import { firstPass } from "../../utilities/firstPass"
import { useCustomer } from "../../utilities/recharge/useCustomer"
import * as $recharge from "../../utilities/recharge/utilites"
import { useStringifiedObjectSearch } from "../../utilities/useStringifiedObjectSearch"
import { useToggle } from "../../utilities/useToggle"

export default function Customer(props) {
  const router = useRouter()
  const { id } = router.query
  return id ? <CustomerPage id={id} path={router.asPath} /> : <Spinner size='xlarge' />
}

const sectionMessageContainerCss = css`
  > section {
    width: 100%;
  }
`

const CustomerPage = (props) => {
  const data = useCustomer(props.id)
  // const customerData = useDiagnostics(props.id)

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
    if (!isLoadingList.filter(Boolean).length) {
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }, isLoadingList)

  const discountMismatch = getDiscountMismatch(subscriptions, addresses, discounts)
  const isTotalMismatch = discountMismatch.isMismatch && !discountMismatch.isSimilar
  const isSimilarMismatch = discountMismatch.isMismatch && discountMismatch.isSimilar
  const isNotMismatch = !discountMismatch.isMismatch

  const fixTotalMismatch = () => {
    const newCode = discountMismatch.expectedCode
    const currentCode = discountMismatch.discountCode
    const addressId = addresses?.[0]?.id
    console.log({ newCode, addresses, addressId, currentCode })
    data.fixCode.mutate({ newCode, addressId, currentCode })
  }

  console.log("fixxxx", data.fixCode)

  const totalMismatchActions = [
    {
      key: "fix",
      text: "Fix Now",
      onClick: fixTotalMismatch,
    },
  ]

  const similarMismatchActions = [
    {
      key: "doIt",
      text: "Let's Do It",
      onClick: fixTotalMismatch,
    },
  ]

  const totalMismatchMessage = data.isReady && isTotalMismatch && (
    <SectionMessage title='Discount code mismatch.' appearance='error' actions={totalMismatchActions}>
      <p>
        <span style={{ width: "100%" }}>
          We expected to see a discount code of "{discountMismatch.expectedCode}""
        </span>
        <span style={{ width: "100%" }}> but found "{discountMismatch.discountCode}" instead.</span>
      </p>
    </SectionMessage>
  )

  const similarMismatchMessage = data.isReady && isSimilarMismatch && (
    <SectionMessage
      title='Promotional discount code applied.'
      appearance='warning'
      actions={similarMismatchActions}
    >
      {data.fixCode.status === "loading" ? (
        <Spinner size='small' />
      ) : (
        <p>
          I suggest swapping the "{discountMismatch.discountCode}" code with "{discountMismatch.expectedCode}".
        </p>
      )}
    </SectionMessage>
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

  const filteredItems = searchFilter.filteredItems
  const cond0 = () => showAllStatuses
  const result0 = filteredItems
  const cond1 = !showCanceled.value && showActive.value
  const result1 = () => $recharge.getActiveSubscriptions(filteredItems)
  const cond2 = !showActive.value && showCanceled.value
  const result2 = () => $recharge.getCanceledSubscriptions(filteredItems)

  const itemsToShow =
    firstPass([
      [cond0, result0],
      [cond1, result1],
      [cond2, result2],
    ]) || []

  const filters = (
    <>
      <Checkbox
        label='Show Active'
        isChecked={showActive.value}
        onChange={showActive.toggle}
        id='only-show-active-subscriptions'
        name='only-show-active-subscriptions'
      />
      <Spacer size='24px' />
      <Checkbox
        isChecked={showCanceled.value}
        label='Show Canceled'
        onChange={showCanceled.toggle}
        id='only-show-canceled-subscriptions'
        name='only-show-canceled-subscriptions'
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
          <Spacer size='8px' style={{ marginTop: "auto" }} />
          <Text is='p'>Discount:</Text>
          <Text is='h5'>{$recharge.getDiscountCode(discounts, address.discount_id) || "N/A"}</Text>
        </>
      )}
    </ListSection>
  )
}
