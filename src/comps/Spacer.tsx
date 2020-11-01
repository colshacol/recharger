import styled from "@emotion/styled"

function getValue(which, props) {
  const input = props[which] || props.size
  return typeof input === "number" ? input + "px" : input
}

export const Spacer = styled.div`
  display: inline-flex;
  width: ${(props: PropsT) => getValue("width", props) || "12px"};
  height: ${(props: PropsT) => getValue("height", props) || "12px"};
`

type PropsT = {
  width?: string | number
  height?: string | number
  size?: string | number
}
