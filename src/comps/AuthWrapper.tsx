import { useSession, signin, signout } from "next-auth/client"
import { useRouter } from "next/router"
import { Spinner } from "./Atlaskit"
import { Grid } from "./Grid"

export const AuthWrapper = (props) => {
  const router = useRouter()
  const [session, isLoading] = useSession()
  const { pathname } = router
  const okPaths = ["/"]

  if (isLoading) {
    return (
      <Grid.Container alignItems='center' justifyContent='center' height='100vh'>
        <Spinner size='xlarge' />
      </Grid.Container>
    )
  }

  if (!session && !okPaths.includes(pathname)) {
    router.push("/")
    return null
  }

  if (session && pathname === "/") {
    router.push("/home")
  }

  return props.children
}
