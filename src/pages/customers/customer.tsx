import { Checkbox } from "@atlaskit/checkbox"
import Lozenge from "@atlaskit/lozenge"
import Spinner from "@atlaskit/spinner"
import Textfield from "@atlaskit/textfield"
import { css } from "@emotion/core"
import { colors } from "@atlaskit/theme"
import dayjs from "dayjs"
import { useRouter } from "next/router"
import * as React from "react"
import { CustomerCard } from "../../comps/CustomerCard"
import { useDiagnostics } from "../../comps/DiagnosticsWrapper"
import * as Grid from "../../comps/Grid"
import WarningIcon from "@atlaskit/icon/glyph/warning"
import SuccessIcon from "@atlaskit/icon/glyph/check-circle"
import InfoIcon from "@atlaskit/icon/glyph/info"
import { N800 } from "@atlaskit/theme/colors"
import { Y200 } from "@atlaskit/theme/colors"
import Flag from "@atlaskit/flag"
import { ListSection } from "../../comps/ListSection"
import { SectionMessage } from "../../comps/SectionMessage"
import { Spacer } from "../../comps/Spacer"
import { Text } from "../../comps/Text"
import { getDiscountMismatch } from "../../utilities/checkDiscountMismatch"
import { firstPass } from "../../utilities/firstPass"
import { useCustomerPage, useDiscountCodeFixer, useRecharge } from "../../utilities/recharge"
import * as $recharge from "../../utilities/recharge/utilites"
import { useStringifiedObjectSearch } from "../../utilities/useStringifiedObjectSearch"
import { useToggle } from "../../utilities/useToggle"
import { AddressSubscriptions } from "#comps/AddressSubscriptions"
import { Label, Table, Layout } from "../../comps/clay"
import { TopBar } from "#comps/TopBar"

export default function Customer(props) {
  const router = useRouter()
  const { id } = router.query
  return id ? <CustomerPage id={id} path={router.asPath} /> : <Spinner size='xlarge' />
}

const CustomerPage = (props) => {
  const query = useCustomerPage(props.id) as any
  const customer = query.data

  console.log({ props, query, customer })

  return (
    <>
      <TopBar />
      <Layout.Container view>
        {query.isLoading && (
          <>
            <Spacer size='24px' />
            <Grid.Container alignItems='center' justifyContent='center' className='SpinnerContainer'>
              <Spinner size='xlarge' />
            </Grid.Container>
            <Spacer size='48px' />
          </>
        )}

        {!query.isLoading && (
          <>
            <Grid.Container className='PageHeader'>
              <Grid.Row>
                <CustomerCard customer={customer} />
              </Grid.Row>
            </Grid.Container>

            <Spacer size='24px' />

            <Grid.Container>
              <Grid.Column width='100%' padding='24px'>
                <Grid.Row justifyContent='space-between' width='100%' flexWrap='nowrap'>
                  <Text is='h2'>
                    Addresses{" "}
                    <Text is='span' fontSize='16px' pb='2px' position='relative' bottom='1px' opacity='0.7'>
                      ({customer.addresses.length})
                    </Text>
                  </Text>
                </Grid.Row>
                {customer.addresses.map((address) => (
                  <AddressSubscriptions customer={customer} address={address} key={address.id} />
                  // <AddressSection key={address.id} address={address} />
                ))}
              </Grid.Column>
            </Grid.Container>
            <Spacer size='48px' />
          </>
        )}
      </Layout.Container>
    </>
  )
}

const AddressSection = (props) => {
  const { address } = props
  const discountCode = address.discount_code || "none"

  return (
    <Grid.Column width='100%' padding='24px'>
      <Grid.Row width='auto' justifyContent='space-between' alignItems='center'>
        <Grid.Column width='100%'>
          <Grid.Row justifyContent='space-between'>
            <div style={{ display: "flex", width: "100%" }}>
              <AddressTitleText>
                {address.address1} {address.address2},
              </AddressTitleText>
              <AddressTitleText>{address.city}, </AddressTitleText>
              <AddressTitleText>{address.province} </AddressTitleText>
              <AddressTitleText>{address.zip}</AddressTitleText>
              <Spacer height='12px' width='24px' />
            </div>

            <div style={{ display: "flex", width: "70%", justifyContent: "flex-end" }}>
              <p>
                Discount code: <span style={{ fontWeight: "bold" }}>{address.discount_code || "NONE"}</span>
              </p>
            </div>
          </Grid.Row>

          <DiscountRow address={address} />
        </Grid.Column>
      </Grid.Row>

      <Grid.Row flexWrap='wrap' paddingY='16px' width='100%' maxHeight='230px' style={{ gap: 24 }}>
        {address.subscriptions.map((subscription) => (
          // <SubscriptionRow key={subscription.id} subscription={subscription} />
          <Grid.Column
            key={subscription.id}
            alignItems='flex-start'
            width='240px'
            padding='16px'
            border={`1px solid ${colors.N40}`}
            borderRadius='6px'
          >
            <div style={{ display: "flex" }}>
              <Lozenge appearance={subscription.status === "ACTIVE" ? "success" : "removed"}>
                {subscription.status}
              </Lozenge>
              <Spacer size='8px' />
              <Text is='small'>({subscription.id})</Text>
            </div>
            <Spacer size='8px' />
            <Text is='h4'>{subscription.product_title}</Text>
            <Spacer size='8px' style={{ marginTop: "auto" }} />
            <Text is='p'>Quantity: {subscription.quantity}</Text>
            <Spacer size='8px' />
            <Text is='h5'>
              Next Charge: {dayjs(subscription.next_charge_scheduled_at).format("MM/DD/YYYY")}
            </Text>
          </Grid.Column>
        ))}
      </Grid.Row>
    </Grid.Column>
  )
}

const AddressTitleText = (props) => {
  return (
    <Text is='h4' style={{ marginRight: 2 }}>
      {props.children}
    </Text>
  )
}

const SubscriptionRow = (props) => {
  const { subscription } = props

  return (
    <Grid.Row width='100%' paddingY='8px'>
      <Grid.Column
        width='80px'
        height='80px'
        backgroundSize='cover'
        backgroundPosition='center'
        backgroundImage='url(https://bityl.co/4IWG)'
      />
      <Grid.Column width='100%' marginLeft='16px'>
        <Grid.Row alignItems='center'>
          <Text is='h5'>{subscription.product_title}</Text>
          <Spacer size='16px' />
          <StatusBadge status={subscription.status} />
        </Grid.Row>
      </Grid.Column>
    </Grid.Row>
  )
}

const StatusBadge = (props) => {
  const appearance = props.status === "CANCELLED" ? "removed" : "success"
  return <Lozenge appearance={appearance}>{props.status}</Lozenge>
}

const DiscountRow = (props) => {
  const fixCode = useDiscountCodeFixer(props.address.customer_id)

  const activeSubscriptions = props.address.subscriptions.filter((item) => {
    return item.status !== "CANCELLED"
  })

  const activeQuantity = activeSubscriptions.reduce((final, item) => {
    return final + item.quantity
  }, 0)

  if (!activeSubscriptions.length) return null

  if (activeQuantity > 1) {
    const expectedCode = `BOXOF${activeQuantity}`

    if (props.address.discount_code == expectedCode) return null

    if (props.address.discount_code !== expectedCode) {
      return (
        <Grid.Row paddingY='24px'>
          <Flag
            appearance='warning'
            icon={<WarningIcon label='Warning' secondaryColor={Y200} />}
            id='warning'
            key='warning'
            title='Mismatched discount code.'
            description={
              fixCode.isLoading ? (
                <Spinner size='small' />
              ) : (
                `Expected code "${expectedCode}" but found "${props.address.discount_code || ""}".`
              )
            }
            actions={[
              {
                content: "Fix It",
                onClick: () =>
                  fixCode.mutate({
                    newCode: expectedCode,
                    addressId: props.address.id,
                    currentCode: props.address.discount_code,
                  }),
              },
            ]}
          />
        </Grid.Row>
      )
    }
  }

  if (props.address.discount_code) {
    if (props.address.discount_code.startsWith("BOX")) {
      return (
        <Grid.Row paddingY='24px'>
          <Flag
            icon={<InfoIcon primaryColor={N800} label='Info' />}
            description={`Expect no "BOX" discount, but found "${props.address.discount_code}".`}
            id='1'
            key='1'
            title='Mismatched discount code.'
          />
        </Grid.Row>
      )
    }
  }

  return null
}
