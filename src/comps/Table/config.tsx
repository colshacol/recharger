import { isBoolean, isNumber, isString } from "is-what"

type HeadCellT = {
  key: string
  content: string
  width?: number
  colSpan?: number
  isSortable?: boolean
  shouldTruncate?: boolean
  shouldDisplay?: boolean
  getRowCell?: any
  [key: string]: any
}

const discountHeadCells: HeadCellT[] = [
  {
    key: "applies_to",
    content: "applies_to",
  },
  {
    key: "applies_to_id",
    content: "applies_to_id",
  },
  {
    key: "applies_to_product_type",
    content: "applies_to_product_type",
  },
  {
    key: "applies_to_resource",
    content: "applies_to_resource",
  },
  {
    key: "channel_settings",
    content: "channel_settings",
    shouldDisplay: false,
  },
  {
    key: "code",
    content: "code",
  },
  {
    key: "created_at",
    content: "created_at",
  },
  {
    key: "discount_type",
    content: "discount_type",
  },
  {
    key: "duration",
    content: "duration",
  },
  {
    key: "duration_usage_limit",
    content: "duration_usage_limit",
  },
  {
    key: "ends_at",
    content: "ends_at",
  },
  {
    key: "first_time_customer_restriction",
    content: "first_time_customer_restriction",
  },
  {
    key: "id",
    content: "id",
  },
  {
    key: "once_per_customer",
    content: "once_per_customer",
  },
  {
    key: "prerequisite_subtotal_min",
    content: "prerequisite_subtotal_min",
  },
  {
    key: "starts_at",
    content: "starts_at",
  },
  {
    key: "status",
    content: "status",
  },
  {
    key: "times_used",
    content: "Times Used",
  },
  {
    key: "updated_at",
    content: "Updated At",
  },
  {
    key: "usage_limit",
    content: "Usage Limit",
  },
  {
    key: "value",
    content: "Value",
  },
]

const createHead = (cells: HeadCellT[]) => {
  function getRowCell(value, row, rows) {
    return !(isString(value) || isNumber(value) || isBoolean(value)) ? JSON.stringify(value) : value
  }

  const normalizedCells = cells.map((config) => {
    return {
      isSortable: false,
      shouldTruncate: true,
      width: 150,
      shouldDisplay: true,
      getRowCell,
      ...config,
    }
  })

  return normalizedCells.filter((cell) => {
    return cell.shouldDisplay
  })
}
