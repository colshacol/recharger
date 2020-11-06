import { signin, signout, useSession } from "next-auth/client"
import { useRouter } from "next/router"
import * as React from "react"
import { fetcher } from "../utilities/fetcher"
import { useTheState } from "../utilities/useTheState"
import { useToggle } from "../utilities/useToggle"
import { Button, DropDown, Icon, Input, Layout, Modal, Nav, useModal } from "./clay"
import { Spacer } from "./Spacer"

export const TopBar = (props) => {
  const router = useRouter()
  const [session, loading] = useSession()
  const isUserPopupOpen = useToggle(false)
  console.log(isUserPopupOpen.value)

  const checkActive = (href) => {
    return router.pathname.startsWith(href)
  }

  return (
    <Layout.Container style={{ height: 64 }}>
      <Layout.Row style={{ height: "100%", alignItems: "center" }}>
        <Layout.Col>
          <h3 style={{ margin: 0 }}>recharger</h3>
        </Layout.Col>
        <Layout.Col md={10} style={{ paddingRight: 0 }}>
          <Nav style={{ alignItems: "center", justifyContent: "flex-end", flexWrap: "nowrap" }}>
            <Nav.Item>
              <Nav.Link active={checkActive("/home")} href='/home'>
                Home
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link active={checkActive("/customers")} href='/customers'>
                Customers
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link active={checkActive("/discounts")} href='/discounts'>
                Discounts
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link active={checkActive("/orders")} href='/orders'>
                Orders
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link active={checkActive("/products")} href='/products'>
                Products
              </Nav.Link>
            </Nav.Item>

            <Spacer size='24px' />

            {!session && (
              <div style={{ display: "inline-flex", alignItems: "center", marginLeft: 24 }}>
                <Button
                  displayType='primary'
                  onClick={() => signin("auth0", { callbackUrl: `${process.env.APP_URL}/auth/success` })}
                >
                  Sign in
                </Button>
              </div>
            )}

            {session && <AuthenticatedNavOptions />}
          </Nav>
        </Layout.Col>
      </Layout.Row>
    </Layout.Container>
  )
}

const AuthenticatedNavOptions = React.memo((props) => {
  const isTokenModalVisible = useTheState(false)
  const [session, isLoading] = useSession()
  const router = useRouter()
  const isDropdownOpen = useTheState(false)
  const token = useTheState("")

  // const { observer, onClose } = useModal({
  //   onClose: () => isTokenModalVisible.setValue(false),
  // })

  // React.useEffect(() => {
  //   if (!isLoading) {
  //     const onError = (response) => {
  //       if (response.type === "NO_RECHARGE_API_TOKEN") {
  //         console.log(response)
  //       }
  //     }
  //     fetcher
  //       .get({ method: "token", action: "get" })
  //       .then((json) => {
  //         console.log("fetcher.get method token action get json: ", json)
  //         token.setValue(json.token)
  //       })
  //       .catch(onError)
  //   }
  // }, [isLoading])

  const trigger = (
    <Button small displayType='secondary'>
      <span className='inline-item inline-item-before'>
        <Icon symbol='user' />
      </span>
      {session.user.email}
    </Button>
  )

  return (
    <>
      <DropDown
        trigger={trigger}
        active={isDropdownOpen.value}
        onActiveChange={isDropdownOpen.setValue}
        alignmentPosition={["bc", "tc"]}
      >
        <DropDown.ItemList>
          <DropDown.Item onClick={() => signout()}>Sign Out</DropDown.Item>
          <DropDown.Group header='Recharge API Token'>
            <DropDown.Item active={false} className='dropdown-input'>
              <div style={{ display: "flex", gap: 8 }}>
                <Input
                  sizing='sm'
                  placeholder='yolo'
                  value={token.value}
                  onChange={(event) => token.setValue(event.target.value)}
                />
                <Button small displayType='secondary'>
                  <Icon symbol='disk' />
                </Button>
              </div>
            </DropDown.Item>
          </DropDown.Group>
        </DropDown.ItemList>
      </DropDown>
      {/* {isTokenModalVisible.value && (
        <Modal observer={observer} size='lg' status='info'>
          <Modal.Header>{"Title"}</Modal.Header>
          <Modal.Body>
            <h1>{"Hello world!"}</h1>
          </Modal.Body>
          <Modal.Footer
            first={
              <Button.Group spaced>
                <Button displayType='secondary'>{"Secondary"}</Button>
                <Button displayType='secondary'>{"Secondary"}</Button>
              </Button.Group>
            }
            last={<Button onClick={onClose}>{"Primary"}</Button>}
          />
        </Modal>
      )} */}
    </>
  )
})
