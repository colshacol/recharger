import styled from "@emotion/styled"
import UIBox from "ui-box"

export const Box = styled(UIBox)`
  display: inline-flex;
`

export const Row = styled(UIBox)`
  display: ${(props: GridPropsT) => (props.inline ? "inline-flex" : "flex")};
  width: ${(props: GridPropsT) => props.width || "100%"};
  overflow-x: ${(props: GridPropsT) => (props.scrollX ? "scroll" : "initial")};
`

export const Column = styled(UIBox)`
  display: flex;
  flex-direction: column;
  width: ${(props: GridPropsT) => props.width || (props.fullWidth && "100%") || "auto"};
  overflow-x: ${(props: GridPropsT) => (props.scrollX ? "scroll" : "initial")};
`

export const Container = styled(UIBox)`
  display: flex;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  flex-wrap: wrap;
  padding: 0 48px;
  overflow-x: ${(props: GridPropsT) => (props.scrollX ? "scroll" : "initial")};
`

export const Grid = {
  Row,
  Column,
  Container,
  Box,
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
}
