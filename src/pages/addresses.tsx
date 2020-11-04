import { Layout } from "../comps/Layout"
import TextField from "@atlaskit/textfield"
import { Table } from "../comps/Table"
import { useRecharge } from "../utilities/recharge"
import { useStringifiedObjectSearch } from "../utilities/useStringifiedObjectSearch"

export default function Addresses() {
  const addresses = useRecharge("getAllAddresses", {}) as any

  const searchFilter = useStringifiedObjectSearch(addresses.data)
  console.log(addresses, searchFilter)

  const barContent = (
    <div style={{ display: "flex" }}>
      <div style={{ flex: "0 0 200px" }}>
        <TextField isCompact placeholder='Filter' aria-label='Filter' onChange={searchFilter.setValue} />
      </div>
    </div>
  )

  return (
    <Layout title='Addresses' crumbText='Addresses' crumbRouteTo='/addresses' bottomBar={barContent}>
      <Table rows={searchFilter.filteredItems} isLoading={addresses.isValidating} pageSize={15}>
        <Table.Column dataKey='id' label='Id' width='120px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='discount_id' label='Discount' width='120px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='customer_id' label='Customer Id' width='120px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='address1' label='Address' width='120px'>
          {(value) => value}
        </Table.Column>

        {/* <Table.Column dataKey='shopify_customer_id' label='shopify_customer_id' width='150px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='email' label='Email Address' width='200px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='first_name' label='First Name'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='last_name' label='Last Name'>
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
        </Table.Column> */}
      </Table>
    </Layout>
  )
}
