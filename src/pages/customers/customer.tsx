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
