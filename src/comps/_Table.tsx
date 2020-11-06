import { Table as ClayTable } from "./clay"

export const Table = (props) => {
  return (
    <ClayTable>
      <ClayTable.Head>
        <ClayTable.Row>
          <ClayTable.Cell expanded headingCell>
            {"Teams"}
          </ClayTable.Cell>
          <ClayTable.Cell headingCell>{"Region"}</ClayTable.Cell>
          <ClayTable.Cell headingCell>{"Country"}</ClayTable.Cell>
        </ClayTable.Row>
      </ClayTable.Head>
      <ClayTable.Body>
        <ClayTable.Row>
          <ClayTable.Cell headingTitle>{"White and Red"}</ClayTable.Cell>
          <ClayTable.Cell>{"South America"}</ClayTable.Cell>
          <ClayTable.Cell>{"Brazil"}</ClayTable.Cell>
        </ClayTable.Row>
        <ClayTable.Row>
          <ClayTable.Cell headingTitle>{"White and Purple"}</ClayTable.Cell>
          <ClayTable.Cell>{"Europe"}</ClayTable.Cell>
          <ClayTable.Cell>{"Spain"}</ClayTable.Cell>
        </ClayTable.Row>
      </ClayTable.Body>
    </ClayTable>
  )
}

export const stringify = (target) => {
  if (["string", "number", "boolean"].includes(typeof target)) {
    return target
  }

  try {
    return JSON.stringify(target)
  } catch (error) {
    console.error("Table - stringify error", error)
    return target
  }
}
