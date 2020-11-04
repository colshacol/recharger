import React from "react"
import EmailIcon from "@atlaskit/icon/glyph/email"
import PhoneIcon from "@atlaskit/icon/glyph/hipchat/dial-out"
import { Avatar, Lozenge, Button } from "./Atlaskit"
import { Grid } from "./Grid"
import { Spacer } from "./Spacer"
import { Text } from "./Text"

export const CustomerCard = ({ customer }) => {
  return (
    <Grid.Row alignItems='flex-start'>
      <Grid.Row width='70%'>
        <Avatar size='xlarge' />
        <Spacer size='8px' />
        <Grid.Column paddingY='8px' alignItems='flex-start'>
          <Grid.Row alignItems='center'>
            <Text is='h2'>
              {customer.first_name} {customer.last_name}
            </Text>
            <Spacer size='12px' />
            <span style={{ paddingTop: 2 }}>
              <Lozenge appearance='success'>{customer.status}</Lozenge>
            </span>
            {/* <Text is='p'>{customer.billing_phone}</Text> */}
          </Grid.Row>
          <Spacer size='8px' />
          <Grid.Column>
            <Grid.Row>
              <PhoneIcon label='phone' />
              <Spacer size='2px' />
              <Text is='p'>{customer.billing_phone || "N/A"}</Text>
            </Grid.Row>
            <Spacer size='2px' />
            <Grid.Row>
              <EmailIcon label='email' />
              <Spacer size='4px' />
              <Text is='p'>{customer.email || "N/A"}</Text>
            </Grid.Row>
          </Grid.Column>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row width='30%' justifyContent='flex-end'>
        {/* <Button>Save</Button> */}
      </Grid.Row>
    </Grid.Row>
  )
}
