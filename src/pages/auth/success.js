import { useSession } from "next-auth/client"
import { useRouter } from "next/router"
import { fetcher } from "../../utilities/fetcher"
import React from "react"

export default (props) => {
  const [session, isLoading] = useSession()
  const router = useRouter()

  router.push("/home")

  // React.useEffect(() => {
  //   if (!isLoading) {
  //     const handleError = (response) => {
  //       if (response.isError && response.type === "NO_RECHARGE_API_TOKEN") {
  //         console.log("NO_RECHARGE_API_TOKEN")
  //       }

  //       console.log(response)
  //     }

  //     const handleSuccess = (json) => {
  //       console.log("fetcher.get newUser json: ", json)
  //       debugger
  //       router.push("/home")
  //     }

  //     fetcher
  //       .get({ method: "newUser", ...session.user })
  //       .then(handleSuccess)
  //       .catch(handleError)
  //   }
  // }, [isLoading])

  return (
    <div style={{ width: 400, height: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <h1>loading...</h1>
    </div>
  )
}
