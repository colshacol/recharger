import { Spinner } from "#comps/Atlaskit"
import { PaginationBarWithBasicItems } from "#comps/clay"
import { Grid } from "#comps/Grid"
import { TopBar } from "#comps/TopBar"
import TextField from "@atlaskit/textfield"
import dayjs from "dayjs"
import Link from "next/link"
import * as React from "react"
import { Label, Layout, Table } from "../../comps/clay"
import { useAllProducts } from "../../utilities/recharge"
import { useTableState } from "../../utilities/useTableState"

const Pagination = (props) => {
  return (
    <Layout.Row style={{ alignItems: "center", padding: "16px 24px", justifyContent: "space-between" }}>
      <TextField isCompact placeholder='Filter' aria-label='Filter' onChange={props.setValue} width={300} />
      <PaginationBarWithBasicItems
        activePage={props.currentPage}
        onPageChange={props.goToPage}
        totalItems={props.filteredData.length}
        spritemap={""}
      />
    </Layout.Row>
  )
}

const filterKeys = ["shopify_product_id", "product_id", "id", "handle", "discount_type", "title"]

export default function Products() {
  const products = useAllProducts()

  const table = useTableState({
    data: products.data || [],
    filterKeys,
    pageSize: 10,
  })

  console.log({ products, table })

  return (
    <>
      <TopBar />
      <Layout.Container view>
        {!products.data && products.isLoading ? (
          <Grid.Container width='100%' marginY='48px' paddingY='48px' justifyContent='center'>
            <Spinner size='xlarge' />
          </Grid.Container>
        ) : (
          <>
            <Pagination {...table} />
            <Layout.Col>
              <Table noWrap headingNoWrap borderedColumns style={{ paddingBottom: 16 }}>
                <Table.Head>
                  <Table.Row>
                    <Table.Cell headingCell headingTitle>
                      Id
                    </Table.Cell>
                    <Table.Cell headingCell headingTitle>
                      Shopify Product Id
                    </Table.Cell>
                    <Table.Cell headingCell headingTitle>
                      Recharge Product Id
                    </Table.Cell>
                    <Table.Cell headingCell headingTitle>
                      Title
                    </Table.Cell>
                    <Table.Cell headingCell headingTitle>
                      Discount Type
                    </Table.Cell>
                    <Table.Cell headingCell headingTitle>
                      Discount Value
                    </Table.Cell>
                    <Table.Cell headingCell headingTitle>
                      Created Date
                    </Table.Cell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {table.pageData.map((product, index) => (
                    <Table.Row key={product.id}>
                      {console.log({ product })}
                      <Table.Cell headingTitle>
                        <Link href={{ pathname: `/products/product`, query: { id: product.id } }}>
                          <a>{product.id}</a>
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{product.shopify_product_id}</Table.Cell>
                      <Table.Cell>{product.product_id}</Table.Cell>
                      <Table.Cell>{product.title}</Table.Cell>
                      <Table.Cell>{product.discount_type}</Table.Cell>
                      <Table.Cell>{product.discount_amount}</Table.Cell>
                      <Table.Cell>{dayjs(product.created_at).format("MM/DD/YYYY")}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Layout.Col>
          </>
        )}
      </Layout.Container>
    </>
  )
}
