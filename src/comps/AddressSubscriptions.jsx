import { useDiscountFixer } from "#utilities/recharge"
import { Card, Icon, Sticker, Checkbox, Layout, Alert, Button } from "./clay"
import { Spacer } from "./Spacer"
import { SubscriptionCard } from "./SubscriptionCard"
import { queryCache } from "../utilities/reactQuery"

const DiscountCodeAlert = (props) => {
  const key = `/api/v0/getCustomerPage?id=${props.customer.id}`
  const [fix, fixStuff] = useDiscountFixer()
  const displayType = props.isWrong ? "warning" : "none"
  const title = props.isWrong ? "Discount Code Mismatch" : "Discount Code Variance"

  if (props.expectedCode === props.actualCode) return null

  console.log({ fix, fixStuff })

  const fixIt = async () => {
    const data = await fix({
      newCode: props.expectedCode,
      addressId: props.address.id,
      currentCode: props.actualCode,
    })
    console.log("DONE FIXING.....????", data)
    queryCache.invalidateQueries(key)
  }

  return (
    <Alert displayType={displayType} title={title}>
      Expected code "{props.expectedCode}" but found "{props.actualCode}".
      <Alert.Footer>
        <Button.Group>
          <Button onClick={fixIt}>Fix Now</Button>
        </Button.Group>
      </Alert.Footer>
    </Alert>
  )
}

const areCodesEqual = (a, b) => {
  if (a !== b) {
    if (typeof a === "string" && typeof b === "string") {
      return a.replace(/-/g, "") === b.replace(/-/g, "")
    } else {
      return false
    }
  }

  return true
}

const getDiscountStuff = (props) => {
  const actualCode = props.address.discount_code

  const activeSubs = props.address.subscriptions.filter((item) => {
    return item.status === "ACTIVE"
  })

  if (activeSubs.length > 1) {
    const expectedCode = `BOXOF${activeSubs.length}`
    const isWrong = !areCodesEqual(actualCode, expectedCode)
    const isVariance = !isWrong && expectedCode !== actualCode
    const data = { expectedCode, actualCode, isWrong, isVariance, ...props }

    const alert = <DiscountCodeAlert {...data} />

    return {
      actualCode,
      expectedCode,
      isWrong,
      isVariance,
      alert,
    }
  }

  return {
    actualCode,
    expectedCode: null,
    isWrong: areCodesEqual(actualCode, expectedCode),
    alert: null,
  }
}

export const AddressSubscriptions = (props) => {
  const title = `${props.customer.billing_address1} ${props.customer.billing_city} ${props.customer.billing_province} ${props.customer.billing_zip} ${props.customer.billing_country}`

  const codeStuff = getDiscountStuff(props)
  console.log({ codeStuff })

  return (
    <Layout.ContentSection>
      <p style={{ fontSize: 20, marginTop: 12 }}>
        {title} <span style={{ fontWeight: 700 }}>({codeStuff.actualCode})</span>
      </p>
      {codeStuff.alert}
      <Card.Group label=''>
        {props.address.subscriptions.map((subscription) => (
          <SubscriptionCard key={subscription.id} rowTitle={title} {...subscription} />
        ))}
      </Card.Group>
    </Layout.ContentSection>
  )
}
