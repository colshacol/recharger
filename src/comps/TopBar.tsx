import * as React from "react"
import { useSession, signin, signout } from "next-auth/client"
import Button from "@atlaskit/button"
import { colors } from "@atlaskit/theme"
import Popup from "@atlaskit/popup"
import Box from "ui-box"

import { Grid } from "./Grid"
import { Text } from "./Text"
import Avatar from "@atlaskit/avatar"
import { Spacer } from "./Spacer"
import { useToggle } from "../utilities/useToggle"

export const TopBar = (props) => {
  const [session, loading] = useSession()
  const isUserPopupOpen = useToggle(false)
  console.log(isUserPopupOpen.value)

  const UserPopupContent = () => (
    <Grid.Column style={{ padding: "8px", width: 160 }} alignItems='flex-start' textAlign='left'>
      <Button appearance='link' onClick={() => signout()}>
        Sign Out
      </Button>
      <Button appearance='link' onClick={() => signout()}>
        Set API Token
      </Button>
    </Grid.Column>
  )

  return (
    <Grid.Row
      alignItems='center'
      justifyContent='space-between'
      height='64px'
      paddingX='24px'
      background={colors.DN0}
      color={"white"}
    >
      <Grid.Container alignItems='center' justifyContent='space-between'>
        <Grid.Column>
          <Text is='h2' style={{ color: "white" }}>
            recharger
          </Text>
        </Grid.Column>
        <Grid.Column>
          {!session && (
            <Grid.Row alignItems='center' justifyContent='flex-end' width='100%'>
              <Button onClick={() => signin("auth0", { callbackUrl: "http://localhost:3000/home" })}>
                Sign in
              </Button>
            </Grid.Row>
          )}
          {session && (
            <Grid.Row alignItems='center' justifyContent='flex-end' width='100%' cursor='pointer'>
              <Popup
                isOpen={isUserPopupOpen.value}
                onClose={() => isUserPopupOpen.setFalse()}
                content={UserPopupContent}
                placement='bottom-end'
                // trigger={(triggerProps) => <Button {...triggerProps}>{session.user.name}</Button>}
                trigger={(triggerProps) => (
                  <Grid.Box {...triggerProps} onClick={isUserPopupOpen.toggle} alignItems='center'>
                    {session.user.name}
                    <Spacer size='8px' />
                    <Avatar size='medium' />
                  </Grid.Box>
                )}
              />
            </Grid.Row>
          )}
        </Grid.Column>
      </Grid.Container>
    </Grid.Row>
  )
}
