import Head from "next/head"
import { BreadcrumbsItem, BreadcrumbsStateless } from "@atlaskit/breadcrumbs"
import PageHeader from "@atlaskit/page-header"
import { Breadcrumbs, useCrumb } from "../comps/Breadcrumbs"
import { Layout } from "../comps/Layout"
import * as Grid from "../comps/Grid"
import { MenuGroup, Section, ButtonItem } from "@atlaskit/menu"

export default function Home() {
  return (
    <Layout title='Home'>
      <Grid.Container>
        <Grid.Row>
          <Grid.Column>
            <p>3 col</p>
          </Grid.Column>
          <Grid.Column>
            <p>2 col</p>
          </Grid.Column>
        </Grid.Row>
      </Grid.Container>
    </Layout>
  )
}

/* <MenuGroup>
  <Section title='Starred'>
    <ButtonItem>Navigation System</ButtonItem>
  </Section>
  <Section hasSeparator>
    <ButtonItem>Create project</ButtonItem>
  </Section>
</MenuGroup> */
