import Page, { Grid } from "@atlaskit/page"
import PageHeader from "@atlaskit/page-header"
import { colors } from "@atlaskit/theme"
import { Link } from "./Link"
import { useRef } from "react"
import { Breadcrumbs, useCrumb } from "./Breadcrumbs"
import { Column, Container, Row } from "./Grid"
import { Spacer } from "./Spacer"
import { TopBar } from "./TopBar"

type PropsT = {
  title: string
  crumbText?: string
  crumbRouteTo?: string
  children: any
}

type LayoutHeaderPropsT = {
  title: string
  actions?: any
  bottomBar?: any
}

function LayoutHeader(props: LayoutHeaderPropsT) {
  const breadcrumbs = <Breadcrumbs />

  return (
    <Container data-widechild>
      <PageHeader breadcrumbs={breadcrumbs} actions={props.actions} bottomBar={props.bottomBar}>
        {props.title}
      </PageHeader>
    </Container>
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
    <Column width='100%'>
      <TopBar />
      <LayoutNavigation />
      <Page data-cid='Layout'>
        <LayoutHeader {...props} />
        {props.children}
      </Page>
      <Spacer size='24px' />
    </Column>
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
    <Row css={{ background: colors.B400, height: 48, display: "flex", alignItems: "center" }}>
      <Container>
        <LayoutNavigationLink href='/home' text='Home' />
        <LayoutNavigationLink href='/discounts' text='Discounts' />
        <LayoutNavigationLink href='/subscriptions' text='Subscriptions' />
        <LayoutNavigationLink href='/addresses' text='Addresses' />
        <LayoutNavigationLink href='/customers' text='Customers' />
      </Container>
    </Row>
  )
}
