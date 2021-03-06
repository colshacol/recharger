import { Checkbox } from "@atlaskit/checkbox"

import Button from "@atlaskit/button"
import Lozenge from "@atlaskit/lozenge"
import { colors } from "@atlaskit/theme"
import { css } from "@emotion/core"
import Link from "next/link"
import Tooltip from "@atlaskit/tooltip"
import React from "react"
import { Avatar } from "../comps/Atlaskit"
import { useDiagnostics } from "../comps/DiagnosticsWrapper"
import * as Grid from "../comps/Grid"
import { Layout } from "../comps/Layout"
import { Spacer } from "../comps/Spacer"
import { Text } from "../comps/Text"
import { useToggle } from "../utilities/useToggle"
import { queryCache } from "../utilities/reactQuery"
import { useRechargeMutation } from "../utilities/recharge"

export default function Home() {
  return (
    <Layout title='Home'>
      <Grid.Container>
        <Grid.Column width='100%' padding='24px'>
          <div>
            <p>content...</p>
          </div>
        </Grid.Column>
      </Grid.Container>
    </Layout>
  )
}

const MultiAddressCustomer = (props) => {
  const { customer } = props
  const discountCodes = customer.discountCodes
  const hasDiscountCodes = customer.hasDiscountCodes
  const hasMismatchedCodes = customer.hasMismatchedCodes
  const fullName = `${customer.first_name} ${customer.last_name}`
  const isInactive = customer.status === "INACTIVE"

  if (!props.showInactive && isInactive) return null

  return (
    <Grid.Column
      alignItems='flex-start'
      width='240px'
      padding='16px'
      border={`1px solid ${colors.N40}`}
      borderRadius='6px'
    >
      <>
        <UserRouteButton fullName={fullName} id={customer.id} />
        <Spacer size='8px' />
        <UserIndicatorRow customer={customer} />
        <Spacer size='8px' style={{ marginTop: "auto" }} />
        {props.children}
      </>
    </Grid.Column>
  )
}

const UserRouteButton = (props) => {
  return (
    <Link href={`/customers/customer?id=${props.id}`}>
      <Grid.Row alignItems='center'>
        <Avatar size='small' />
        <Spacer size='8px' />
        <Text is='a' fontSize='16px' fontWeight={600}>
          {props.fullName}
        </Text>
      </Grid.Row>
    </Link>
  )
}

const UserIndicatorRow = (props) => {
  const isUserActive = props.customer.status === "ACTIVE"
  const hasMismatchedCodes = props.customer.hasMismatchedCodes
  const statusAppearance = isUserActive ? "success" : "moved"
  const hasDiscounts = !!props.customer.discountCodes.length

  return (
    <Grid.Row alignItems='center'>
      <Lozenge appearance={statusAppearance}>{props.customer.status}</Lozenge>
      <Spacer size='8px' />
      {hasMismatchedCodes && (
        <span style={{ marginBottom: 2 }}>
          <Tooltip content='Mismatched discount code'>
            <Lozenge appearance='removed'>DISCOUNTS</Lozenge>
          </Tooltip>
        </span>
      )}

      {!hasMismatchedCodes && hasDiscounts && <Lozenge>DISCOUNTS</Lozenge>}

      <Spacer size='8px' />
      <Text is='small'>({props.customer.id})</Text>
    </Grid.Row>
  )
}

const MismatchFixer = (props) => {
  const address = props.customer.addresses?.[0]
  const newCode = address?.discounts?.[0]?.suggestedCode
  const currentCode = address?.discounts?.[0]?.code
  const addressId = address.id
  console.log(props.customer.addresses)

  const [mutate, { status, data, error }] = useRechargeMutation({
    method: "replaceCode",
  })

  console.log({ newCode, addressId, currentCode })

  const fixMe = async (args) => {
    const data = await mutate({ newCode, addressId, currentCode })
    queryCache.invalidateQueries("allAddresses")
  }

  return (
    <div style={{ marginTop: 8 }}>
      <Button>Fix Me</Button>
    </div>
  )
}

const actionsRowCss = css`
  display: flex;
  flex-direction: row;
  padding: 16px 0;
`
