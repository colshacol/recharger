import DynamicTable from "@atlaskit/dynamic-table"
import { Layout } from "../Layout"
import * as Grid from "../Grid"
import { isPrimitive, isAnyObject, getType, isNull, isUndefined } from "is-what"

type TablePropsT = {
  data: any[]
}

export const Table: React.FunctionComponent<TablePropsT> = (props) => {
  const head = { cells: discountHeadCells }
  const rows = props.data ? getRows(discountHeadCells, props.data) : []
  const isLoading = !props.data.length

  return (
    <Grid.Container>
      <Grid.Column scrollX>
        <DynamicTable
          isLoading={isLoading}
          caption='All Discounts'
          head={head}
          rows={rows}
          rowsPerPage={10}
          defaultPage={1}
          loadingSpinnerSize='large'
          defaultSortKey='id'
          defaultSortOrder='ASC'
          // onSort={() => console.log("onSort")}
          // onSetPage={() => console.log("onSetPage")}
        />
      </Grid.Column>
    </Grid.Container>
  )
}

Table.defaultProps = {
  data: [],
}

function isValidCellValue(value) {
  return !isNull(value) && !isUndefined(value)
}

function TableEmptyCellText() {
  return <p css={{ opacity: 0.25, fontStyle: "italic" }}>no data</p>
}

const getRows = (headCells, data = []) => {
  function getInitialValue(config, row) {
    const value = row[config.key]
    const args = [value, row, data]
    return config.getRowContent?.(...args) || value
  }

  function getCell(row) {
    return (config) => {
      const content = getInitialValue(config, row)
      const isValid = isValidCellValue(content)
      const finalContent = isValid ? content : <TableEmptyCellText />
      return { key: config.key, content: finalContent }
    }
  }

  function getRow(row, index) {
    return {
      key: `row-${index}`,
      cells: headCells.map(getCell(row)),
    }
  }

  return data.map(getRow)
}
