import Spinner from "@atlaskit/spinner"
import { useRouter } from "next/router"
import * as React from "react"
import { CustomerCard } from "../../comps/CustomerCard"
import * as Grid from "../../comps/Grid"
import { Layout } from "../../comps/Layout"
import { useDiscount } from "../../utilities/recharge/hooks"

export default function Discount(props) {
  const router = useRouter()
  const { id } = router.query
  return id ? <DiscountPage id={id} path={router.asPath} /> : <Spinner size='xlarge' />
}

const DiscountPage = (props) => {
  const discount = useDiscount(props.id)

  return (
    <Layout title={`Customer (${props.id})`} crumbText='Customer' crumbRouteTo={props.path}>
      <Grid.Container>
        <Grid.Row>{discount.data?.code}</Grid.Row>
      </Grid.Container>
    </Layout>
  )
}
