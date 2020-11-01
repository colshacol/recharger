import AtlasSectionMessage from "@atlaskit/section-message"
import { css } from "@emotion/core"
import { Grid } from "./Grid"

export const SectionMessage = (props) => {
  return (
    <Grid.Container css={containerCss}>
      <AtlasSectionMessage {...props} />
    </Grid.Container>
  )
}

const containerCss = css`
  padding: 48px 24px;
  justify-content: center;

  > section {
    width: 100%;
  }
`
