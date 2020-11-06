import { Layout, CardWithInfo, Link } from "./clay"
import { useTheState } from "../utilities/useTheState"

export const SubscriptionCard = (props) => {
  const isSelected = useTheState(false)
  const label = SUBSCRIPTION_CARD_STATUS_LABELS[props.status]
  const actions = useSubscriptionCardActions(props)

  return (
    <CardWithInfo
      flushHorizontal
      actions={actions}
      href={`/products/${props.id}`}
      labels={[label]}
      onSelectChange={isSelected.setValue}
      selected={isSelected.value}
      stickerProps={getStickerProps(props.quantity)}
      title={props.product_title}
      imgProps={{
        src: props.product.images.medium,
        style: {
          filter: "brightness(0.5)",
        },
      }}
      description={
        <div>
          <div style={{ display: "flex", gap: 8 }}>
            <div>
              <small>Subscription ID:</small>
            </div>
            <div style={{ paddingLeft: 0 }}>
              <Link href='#' displayType='primary'>
                <small style={{ color: "#0b5fff" }}>{props.id}</small>
              </Link>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {/* <div verticalAlign='center'>
              <small>Start date: 12/20/1993</small>
            </div> */}
            <div>
              <small>Next charge: 12/20/1993</small>
            </div>
          </div>
        </div>
      }
    />
  )
}

const getStickerProps = (quantity) => ({
  // content: <TruckIcon />,
  content: quantity,
  displayType: "secondary",
})

const SUBSCRIPTION_CARD_STATUS_LABELS = {
  ACTIVE: {
    displayType: "success",
    value: "ACTIVE",
  },

  CANCELLED: {
    displayType: "secondary",
    value: "CANCELLED",
  },

  EXPIRED: {
    displayType: "warning",
    value: "EXPIRED",
  },
}

const useSubscriptionCardActions = (subscription) => {
  // TODO: Cancel a subscription.
  const cancelSubscription = () => {}

  const cancelSubscriptionAction = {
    label: "Cancel Subscription",
    onClick: cancelSubscription,
  }

  // TODO: Make href dynamic.
  const viewInShopifyAction = {
    label: "View In Shopify",
    href: "buy.pedersonsfarms.com/admin/apps/0009de8c024a6126315f5dcd4250fd61/orders",
  }

  return [cancelSubscriptionAction, { type: "divider" }, viewInShopifyAction]
}
