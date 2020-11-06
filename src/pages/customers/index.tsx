import * as React from "react"
import { Layout as PageLayout } from "../../comps/Layout"
import { Label, Table, Layout } from "../../comps/clay"
import Link from "next/link"
import { useAllCustomers, useRecharge } from "../../utilities/recharge"
import { useStringifiedObjectSearch } from "../../utilities/useStringifiedObjectSearch"
import TextField from "@atlaskit/textfield"
import dayjs from "dayjs"
import { usePagination } from "react-use-pagination"
import { useEffect, useRef } from "react"
import { useState } from "react"
import { useImmer } from "use-immer"
import mems from "mems"
import { TopBar } from "#comps/TopBar"
import { Icon, Button, PaginationBar, PaginationBarWithBasicItems } from "#comps/clay"

const lowerString = (item) => {
  return typeof item === "string" ? item.toLowerCase() : JSON.stringify(item).toLowerCase()
}

const getMatches = mems((list, fields, input) => {
  if (!input) return list

  return list.filter((item) => {
    console.log("filtering...", input)
    return fields.reduce((final, field) => {
      if (final) return true
      return lowerString(item[field]).includes(input)
    }, false)
  })
})

// const useTableSearchFilter = (data = [], fields) => {
//   const [value, updateValue] = useImmer("")
//   const [filteredItems, setFilteredItems] = useState(data)
//   const [originals, setOriginals] = useImmer({ data, fields })
//   const timeout = useRef(null)

//   useEffect(() => {
//     if (data.length) {
//       setFilteredItems(data)

//       setOriginals((draft) => {
//         draft.data = data
//       })
//     }
//   }, [data.length])

//   const setValue = (eventOrValue) => {
//     const value = typeof eventOrValue === "string" ? eventOrValue : eventOrValue?.target?.value
//     timeout.current && clearTimeout(timeout.current)

//     updateValue((draft) => {
//       return value
//     })

//     timeout.current = setTimeout(() => {
//       setFilteredItems(getMatches(originals.data, originals.fields, value))
//       clearTimeout(timeout.current)
//     }, 500)
//   }

//   return {
//     filteredItems,
//     value,
//     setValue,
//   }
// }

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

const useTableState = ({ data, filterKeys, pageSize }) => {
  const timeout = useRef(null)
  const original = useRef({ data, filterKeys })

  const [state, setState] = useImmer({
    searchValue: "",
    filteredData: [],
    pages: 1,
    currentPage: 1,
  })

  const getPagination = (data) => {
    return {
      pages: Math.max(1, Math.ceil(data.length / pageSize)),
      currentPage: 1,
    }
  }

  const updateFilteredData = () => {
    setState((draft) => {
      const data = getMatches(original.current.data, original.current.filterKeys, draft.searchValue)
      Object.assign(draft, getPagination(data))
      draft.filteredData = data
    })
  }

  const goToPage = (number) => {
    console.log({ number })
    setState((draft) => {
      draft.currentPage = number
    })
  }

  const goToNextPage = () => {
    setState((draft) => {
      if (draft.pages < draft.currentPage) {
        draft.currentPage++
      }
    })
  }

  const goToPreviousPage = () => {
    setState((draft) => {
      if (draft.currentPage > 1) {
        draft.currentPage--
      }
    })
  }

  const setValue = (event) => {
    timeout.current && clearTimeout(timeout.current)

    timeout.current = setTimeout(() => {
      updateFilteredData()
      clearTimeout(timeout.current)
    }, 500)

    setState((draft) => {
      draft.searchValue = event.target.value
    })
  }

  useEffect(() => {
    data.length &&
      setState((draft) => {
        original.current.data = data
        draft.filteredData = data
        Object.assign(draft, getPagination(data))
      })
  }, [data.length])

  const startCut = (state.currentPage - 1) * pageSize
  const endCut = startCut + pageSize
  const pageData = state.filteredData.slice(startCut, endCut)
  console.log({ startCut, endCut, pageData })

  return {
    ...original.current,
    ...state,
    setValue,
    pageData,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  }
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
  const customers = useAllCustomers() as any

  const table = useTableState({
    data: customers.data || [],
    filterKeys,
    pageSize: 10,
  })

  return (
    <>
      <TopBar />
      <Layout.Container view>
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
      </Layout.Container>
    </>
  )
}
