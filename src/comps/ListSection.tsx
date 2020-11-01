import Button from "@atlaskit/button"
import { colors } from "@atlaskit/theme"
import * as React from "react"
import { Spinner } from "./Atlaskit"
import { Spacer } from "./Spacer"
import { Text } from "./Text"
import { Grid } from "./Grid"

export const ListSection = (props) => {
  const loadingBody = (
    <Grid.Container width='100%' marginY='48px' paddingY='48px' justifyContent='center'>
      <Spinner size='xlarge' />
    </Grid.Container>
  )

  const resetFiltersButton = props.resetFilters && (
    <Grid.Row justifyContent='flex-end' alignItems='center'>
      <Button appearance='subtle' onClick={props.resetFilters}>
        Reset Filters
      </Button>
    </Grid.Row>
  )

  const titleRow = (
    <Grid.Row justifyContent='space-between' width='100%' flexWrap='nowrap'>
      <Grid.Row width='300px'>
        <Text is='h2'>{props.title}</Text>
      </Grid.Row>
      {resetFiltersButton}
    </Grid.Row>
  )

  const subTitle = props.subTitle && (
    <Grid.Row justifyContent='flex-start' alignItems='center' width='100%'>
      <Text is='h4'>{props.subTitle}</Text>
    </Grid.Row>
  )

  const filters = props.filters && (
    <Grid.Row justifyContent='flex-end' width='100%'>
      {props.filters}
    </Grid.Row>
  )

  const filtersRow = (
    <Grid.Row justifyContent='space-between' flexWrap='nowrap' width='100%'>
      {subTitle}
      {filters}
    </Grid.Row>
  )

  return (
    <Grid.Container>
      <Grid.Column width='100%'>
        {titleRow}
        <Spacer size='8px' />
        {filtersRow}
        <Spacer size='12px' />
        {props.isLoading ? (
          loadingBody
        ) : (
          <Grid.Row flexWrap='wrap' padding='16px' width='100%' minHeight='170px' style={{ gap: 24 }}>
            {props.items.map((item) => (
              <Grid.Column
                key={item.id}
                alignItems='flex-start'
                width='240px'
                padding='16px'
                border={`1px solid ${colors.N40}`}
                borderRadius='6px'
              >
                {props.children(item)}
              </Grid.Column>
            ))}
          </Grid.Row>
        )}
      </Grid.Column>
    </Grid.Container>
  )
}
