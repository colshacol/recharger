import { useRouter } from "next/router"

export const Link = (props) => {
  const router = useRouter()

  const navigate = (event) => {
    if (!props.onClickOverride) {
      event.preventDefault()
      router.push(props.href)
    }
  }

  return <a {...props} onClick={navigate} />
}
