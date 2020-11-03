import React from "react"
import { Layout } from "../comps/Layout"
import { Table } from "../comps/Table"
import TextField from "@atlaskit/textfield"
import { useRecharge } from "../utilities/recharge"
import { useStringifiedObjectSearch } from "../utilities/useStringifiedObjectSearch"

export default function Subscriptions() {
  const subscriptions = useRecharge({
    dataType: "subscription",
    method: "listAll",
  }) as any

  React.useEffect(() => {
    console.log("<Subscriptions>", subscriptions.data)
  }, [subscriptions.data])

  const searchFilter = useStringifiedObjectSearch(subscriptions.data)

  const barContent = (
    <div style={{ display: "flex" }}>
      <div style={{ flex: "0 0 200px" }}>
        <TextField isCompact placeholder='Filter' aria-label='Filter' onChange={searchFilter.setValue} />
      </div>
    </div>
  )

  return (
    <Layout
      title='Subscriptions'
      crumbText='Subscriptions'
      crumbRouteTo='/subscriptions'
      bottomBar={barContent}
    >
      <Table rows={searchFilter.filteredItems} isLoading={subscriptions.isValidating} pageSize={15}>
        <Table.Column dataKey='id' label='Id' width='120px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='address_id' label='Address Id' width='120px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='customer_id' label='Customer Id' width='120px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='email' label='Email Address' width='120px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='status' label='Status' width='120px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='price' label='Price' width='120px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='has_queued_charges' label='Has Queued Charges' width='120px'>
          {(value) => String(!!value)}
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
