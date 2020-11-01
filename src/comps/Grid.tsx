import styled from "@emotion/styled"
import Box from "ui-box"

export const Row = styled(Box)`
  display: ${(props: GridPropsT) => (props.inline ? "inline-flex" : "flex")};
  width: ${(props: GridPropsT) => props.width || "100%"};
  overflow-x: ${(props: GridPropsT) => (props.scrollX ? "scroll" : "initial")};
`

export const Column = styled(Box)`
  display: flex;
  flex-direction: column;
  width: ${(props: GridPropsT) => props.width || (props.fullWidth && "100%") || "auto"};
  overflow-x: ${(props: GridPropsT) => (props.scrollX ? "scroll" : "initial")};
`

export const Container = styled(Box)`
  display: flex;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  flex-wrap: wrap;
  padding: 0 24px;
  overflow-x: ${(props: GridPropsT) => (props.scrollX ? "scroll" : "initial")};

  & > :first-child {
    width: ${(props) => (props.wideChild ? "100%" : "")};
  }
`

export const Grid = {
  Row,
  Column,
  Container,
}

Row.defaultProps = {
  className: "Row",
}

Column.defaultProps = {
  className: "Column",
}

Container.defaultProps = {
  className: "Container",
}

type GridPropsT = {
  scrollX?: boolean
  scrollY?: boolean
  fullWidth?: boolean
  width?: string
  inline?: boolean
  wideChild?: boolean
}
