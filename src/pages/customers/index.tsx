import { Layout } from "../../comps/Layout"
import { Table } from "../../comps/Table"
import Link from "next/link"
import { useRecharge } from "../../utilities/recharge"
import { useStringifiedObjectSearch } from "../../utilities/useStringifiedObjectSearch"
import TextField from "@atlaskit/textfield"

export default function Customers() {
  const customers = useRecharge({
    dataType: "customer",
    method: "listAll",
  }) as any

  const searchFilter = useStringifiedObjectSearch(customers.data)

  const barContent = (
    <div style={{ display: "flex" }}>
      <div style={{ flex: "0 0 200px" }}>
        <TextField isCompact placeholder='Filter' aria-label='Filter' onChange={searchFilter.setValue} />
      </div>
      {/* <div style={{ flex: "0 0 200px", marginLeft: 8 }}>
        <Select spacing='compact' placeholder='Choose an option' aria-label='Choose an option' />
      </div> */}
    </div>
  )

  return (
    <Layout title='Customers' crumbText='Customers' crumbRouteTo='/customers' bottomBar={barContent}>
      <Table rows={searchFilter.filteredItems} isLoading={customers.isLoading} pageSize={15}>
        <Table.Column dataKey='id' label='Id' width='120px'>
          {(value) => (
            <Link href={{ pathname: "/customers/customer", query: { id: value } }}>
              {JSON.stringify(value)}
            </Link>
          )}
        </Table.Column>
        {/* <Table.Column dataKey='hash' label='Hash' width='200px' shouldTruncate>
        {(value) => value}
        </Table.Column> */}
        <Table.Column dataKey='shopify_customer_id' label='shopify_customer_id' width='150px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='email' label='Email Address' width='200px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='first_name' label='First Name' width='120px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='last_name' label='Last Name' width='130px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='billing_address1' label='Billing Address' width='200px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='billing_city' label='Billing City' width='120px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='billing_province' label='Billing Province' width='120px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='billing_zip' label='Billing Zip' width='80px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='billing_country' label='Billing Country' width='120px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='billing_phone' label='Billing Phone' width='150px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='status' label='Status' width='100px'>
          {(value) => value}
        </Table.Column>
      </Table>
    </Layout>
  )
}
