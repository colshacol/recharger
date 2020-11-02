import { Layout } from "../comps/Layout"
import { Table } from "../comps/Table"
import { useRechargeApi } from "../utilities/useRechargeApi"
import dayjs from "dayjs"
import * as Grid from "../comps/Grid"
import { Text } from "../comps/Text"
import { useImmer } from "use-immer"
import TextField from "@atlaskit/textfield"
import ButtonGroup from "@atlaskit/button/button-group"
import Select from "@atlaskit/select"
import Popup from "@atlaskit/popup"
import Button from "@atlaskit/button"
import StandardButton from "@atlaskit/button/standard-button"
import { useRecharge } from "../utilities/recharge"
import { Spacer } from "../comps/Spacer"
import { useStringifiedObjectSearch } from "../utilities/useStringifiedObjectSearch"

export default function Discounts() {
  const discounts = useRecharge({
    dataType: "discount",
    method: "listAll",
  }) as any

  const searchFilter = useStringifiedObjectSearch(discounts.data)
  console.log(discounts, searchFilter)

  const title = (
    <Grid.Column justifyContent='flex-start' alignItems='flex-start'>
      <Text as='h3'>All Discounts</Text>
      <Spacer size='24px' />
      <span>
        <Button>Click Me</Button>
      </span>
    </Grid.Column>
  )

  const actions = false && (
    <ButtonGroup>
      <Button appearance='primary'>Primary Action</Button>
      <Button>Default</Button>
      <Button>...</Button>
    </ButtonGroup>
  )

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
    <Layout
      title='Discounts'
      crumbText='Discounts'
      crumbRouteTo='/discounts'
      actions={actions}
      bottomBar={barContent}
    >
      <Table rows={searchFilter.filteredItems} isLoading={discounts.isValidating} pageSize={10}>
        <Table.Column dataKey='code' label='Code' width='200px'>
          {(value) => <CodeCell value={value} />}
        </Table.Column>
        <Table.Column dataKey='id' label='Id' width='120px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='value' label='Value' width='80px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='discount_type' label='Type' width='120px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='status' label='Status' width='100px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='duration' label='Duration'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='starts_at' label='Starts At' width='100px'>
          {(value) => dayjs(value).format("MM/DD/YYYY")}
        </Table.Column>
        <Table.Column dataKey='ends_at' label='Ends At' width='100px'>
          {(value) => dayjs(value).format("MM/DD/YYYY")}
        </Table.Column>
        <Table.Column dataKey='usage_limit' label='Usage Limit' width='80px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='times_used' label='Times Used' width='80px'>
          {(value) => value}
        </Table.Column>
        <Table.Column dataKey='applies_to' label='Applies To' width='100px'>
          {(value) => value}
        </Table.Column>
      </Table>
    </Layout>
  )
}

const CodeCell = (props) => {
  const [state, updateState] = useImmer({
    isCodeOpen: false,
  })

  const toggleCode = (bool) => {
    updateState((draft) => {
      draft.isCodeOpen = bool
    })
  }

  const Content = () => (
    <Grid.Column style={{ padding: "8px", width: 120 }}>
      <p>Foo</p>
      <p>Bar</p>
      <p>Baz</p>
    </Grid.Column>
  )

  return (
    <Popup
      isOpen={state.isCodeOpen}
      onClose={() => toggleCode(false)}
      placement='bottom-start'
      content={Content}
      trigger={(triggerProps) => (
        <Button {...triggerProps} appearance='link' onClick={() => toggleCode(true)}>
          {props.value}
        </Button>
      )}
    />
  )
}
