import { css } from "@emotion/core"
import AtlasToggle from "@atlaskit/toggle"
import { Text } from "./Text"
import { Spacer } from "./Spacer"

export const Toggle = (props) => {
  const { label, direction, ...otherProps } = props

  return (
    <div css={toggleContainer} style={{ display: "flex", flexDirection: direction, alignItems: "center" }}>
      <Text as='label' css={labelCss} htmlFor={props.id}>
        {label}
      </Text>
      <Spacer size={direction === "row" ? "8px" : "2px"} />
      <AtlasToggle {...otherProps} />
    </div>
  )
}

Toggle.defaultProps = {
  direction: "row",
  label: "GIVE ME A LABEL",
  id: "",
  name: "",
}

const labelCss = css`
  font-size: 0.857143em;
  font-style: inherit;
  line-height: 1.33333;
  color: #6b778c;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 4px;
  margin-top: 0px;
`

const toggleContainer = css`
  > label > div {
    /* background: red; */
    height: 28px;
    width: 50px;
  }

  > label > div > div > span {
    bottom: 4px;
    left: 6px;
  }
`
