import { Spinner } from "#comps/Atlaskit"
import { PaginationBarWithBasicItems } from "#comps/clay"
import { Grid } from "#comps/Grid"
import { TopBar } from "#comps/TopBar"
import TextField from "@atlaskit/textfield"
import dayjs from "dayjs"
import Link from "next/link"
import * as React from "react"
import { Label, Layout, Table } from "../../comps/clay"
import { useAllCustomers } from "../../utilities/recharge"
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

const filterKeys = [
  "shopify_customer_id",
  "first_name",
  "last_name",
  "email",
  "billing_address1",
  "billing_city",
  "billing_province",
  "billing_zip",
  "billing_country",
  "billing_phone",
]

export default function Customers() {
  const customers = useAllCustomers()

  const table = useTableState({
    data: customers.data || [],
    filterKeys,
    pageSize: 10,
  })

  return (
    <>
      <TopBar />
      <Layout.Container view>
        {customers.isLoading ? (
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
                      Shopify Customer Id
                    </Table.Cell>
                    <Table.Cell headingCell headingTitle>
                      Email Address
                    </Table.Cell>
                    <Table.Cell headingCell headingTitle>
                      Status
                    </Table.Cell>
                    <Table.Cell headingCell headingTitle>
                      First Name
                    </Table.Cell>
                    <Table.Cell headingCell headingTitle>
                      Last Name
                    </Table.Cell>
                    <Table.Cell headingCell headingTitle>
                      Created Date
                    </Table.Cell>
                    <Table.Cell headingCell headingTitle>
                      Billing Address
                    </Table.Cell>
                    <Table.Cell headingCell headingTitle>
                      Billing City
                    </Table.Cell>
                    <Table.Cell headingCell headingTitle>
                      Billing Province
                    </Table.Cell>
                    <Table.Cell headingCell headingTitle>
                      Billing Zip
                    </Table.Cell>
                    <Table.Cell headingCell headingTitle>
                      Billing Country
                    </Table.Cell>
                    <Table.Cell headingCell headingTitle>
                      Billing Phone
                    </Table.Cell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {table.pageData.map((customer, index) => (
                    <Table.Row key={customer.id}>
                      <Table.Cell headingTitle>
                        <Link href={{ pathname: `/customers/customer`, query: { id: customer.id } }}>
                          {customer.shopify_customer_id}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{customer.email}</Table.Cell>
                      <Table.Cell>
                        {customer.status === "ACTIVE" ? (
                          <Label displayType='success'>ACTIVE</Label>
                        ) : (
                          <Label displayType='secondary'>INACTIVE</Label>
                        )}
                      </Table.Cell>
                      <Table.Cell>{customer.first_name}</Table.Cell>
                      <Table.Cell>{customer.last_name}</Table.Cell>
                      <Table.Cell>{dayjs(customer.created_at).format("MM/DD/YYYY")}</Table.Cell>
                      <Table.Cell>{customer.billing_address1}</Table.Cell>
                      <Table.Cell>{customer.billing_city}</Table.Cell>
                      <Table.Cell>{customer.billing_province}</Table.Cell>
                      <Table.Cell>{customer.billing_zip}</Table.Cell>
                      <Table.Cell>{customer.billing_country}</Table.Cell>
                      <Table.Cell>{customer.billing_phone}</Table.Cell>
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
