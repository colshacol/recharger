import DynamicTable from "@atlaskit/dynamic-table"
import { Layout } from "./Layout"
import * as Grid from "./Grid"
import { isPrimitive, isAnyObject, getType, isNull, isUndefined } from "is-what"
import * as React from "react"

export const Table = (props) => {
  const columnConfigs = Array.from(props.children).map((child: any) => {
    const childProps = child.props
    const renderRowCell = childProps.children

    return {
      key: childProps.dataKey,
      content: childProps.label,
      isSortable: childProps.isSortable,
      shouldTruncate: childProps.shouldTruncate,
      width: childProps.width,
      renderRowCell,
    }
  })

  const rows = props.rows.map((row, index) => {
    return {
      key: `row-${index}`,
      cells: columnConfigs.map((config) => {
        return {
          key: config.key,
          content: config.renderRowCell(row[config.key], row, props.rows),
        }
      }),
    }
  })

  React.useEffect(() => {
    const container = document.querySelector("#tableContainer")
    const table = document.querySelector("#tableContainer > div")

    table.style.overflowX = "scroll"
    table.classList.add("prettyScrollBar")
    table.style.maxWidth = `${container.offsetWidth}px`
  }, [])

  return (
    <Grid.Container>
      <Grid.Column id='tableContainer' width='100%'>
        <DynamicTable
          caption={props.title}
          isLoading={props.isLoading}
          rowsPerPage={props.pageSize}
          defaultPage={props.defaultPage}
          defaultSortKey={props.defaultSortKey}
          defaultSortOrder={props.defaultSortOrder}
          loadingSpinnerSize='large'
          // onSort={() => console.log("onSort")}
          // onSetPage={() => console.log("onSetPage")}
          head={{ cells: columnConfigs }}
          rows={props.isLoading ? [] : rows}
          isFixedSize
        />
      </Grid.Column>
    </Grid.Container>
  )
}

Table.Column = (props) => {
  return null
}

Table.Column.defaultProps = {
  width: "150px",
  shouldTruncate: true,
  isSortable: false,
}

Table.defaultProps = {
  isLoading: false,
  pageSize: 15,
  defaultPage: 1,
  defaultSortKey: "id",
  defaultSortOrder: "ASC",
  rows: [],
}
