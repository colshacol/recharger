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
import { useCustomerPage, useDiscountCodeFixer, useProduct, useRecharge } from "../../utilities/recharge"
import * as $recharge from "../../utilities/recharge/utilites"
import { useStringifiedObjectSearch } from "../../utilities/useStringifiedObjectSearch"
import { useToggle } from "../../utilities/useToggle"
import { AddressSubscriptions } from "#comps/AddressSubscriptions"
import { Label, Table, Layout } from "../../comps/clay"
import { TopBar } from "#comps/TopBar"

export default function Product(props) {
  const router = useRouter()
  const { id } = router.query
  return id ? <ProductPage id={id} path={router.asPath} /> : <Spinner size='xlarge' />
}

const ProductPage = (props) => {
  const query = useProduct(props.id) as any
  const product = query.data

  console.log({ props, query, product })

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
                <h3>{product.title}</h3>
              </Grid.Row>
            </Grid.Container>

            <Spacer size='24px' />
          </>
        )}
      </Layout.Container>
    </>
  )
}
