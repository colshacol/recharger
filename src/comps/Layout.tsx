import Page from "@atlaskit/page"
import PageHeader from "@atlaskit/page-header"
import { colors } from "@atlaskit/theme"
import { Link } from "./Link"
import { Text } from "./Text"
import { useRef } from "react"
import { Breadcrumbs, useCrumb } from "./Breadcrumbs"
import { Grid } from "./Grid"
import { Spacer } from "./Spacer"
import { TopBar } from "./TopBar"

type PropsT = {
  title: string
  crumbText?: string
  crumbRouteTo?: string
  children: any
  actions?: any
  bottomBar?: any
}

type LayoutHeaderPropsT = {
  title: string
  actions?: any
  bottomBar?: any
}

function LayoutHeader(props: LayoutHeaderPropsT) {
  const breadcrumbs = <Breadcrumbs />

  return (
    <Grid.Container data-widechild className='LayoutHeader'>
      <PageHeader breadcrumbs={breadcrumbs} actions={props.actions} bottomBar={props.bottomBar}>
        {props.title}
      </PageHeader>
    </Grid.Container>
  )
}

export const Layout: React.FunctionComponent<PropsT> = (props) => {
  const shouldUseCrumb = useRef(props.crumbText)

  !!shouldUseCrumb.current &&
    useCrumb({
      text: props.crumbText,
      routeTo: props.crumbRouteTo,
    })

  return (
    <Grid.Column width='100%' className='Layout' height='100%'>
      <TopBar />
      <LayoutNavigation />
      <Grid.Column
        data-testid='LayoutBody'
        maxHeight='calc(100vh - 112px)'
        overflowY='scroll'
        paddingBottom='24px'
      >
        <LayoutHeader {...props} />
        {props.children}
      </Grid.Column>
      <Spacer size='24px' />
    </Grid.Column>
  )
}

type LayoutNavigationLinkPropsT = {
  href: string
  text: string
}

const LayoutNavigationLink: React.FunctionComponent<LayoutNavigationLinkPropsT> = (props) => {
  return (
    <Link href={props.href}>
      <span style={{ cursor: "pointer", marginRight: 48, color: colors.N10 }}>{props.text}</span>
    </Link>
  )
}

type LayoutNavigationPropsT = {}

const LayoutNavigation: React.FunctionComponent<LayoutNavigationPropsT> = (props) => {
  return (
    <Grid.Row
      css={{ background: colors.B400, height: 48, display: "flex", alignItems: "center" }}
      className='LayoutNavigation'
    >
      <Grid.Container>
        <LayoutNavigationLink href='/home' text='Home' />
        <LayoutNavigationLink href='/discounts' text='Discounts' />
        <LayoutNavigationLink href='/subscriptions' text='Subscriptions' />
        <LayoutNavigationLink href='/addresses' text='Addresses' />
        <LayoutNavigationLink href='/customers' text='Customers' />
      </Grid.Container>
    </Grid.Row>
  )
}
