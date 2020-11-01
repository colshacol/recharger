import NextLink from "next/link"

type LinkPropsT = {
  href?: string
  onClick?: Function
}

export const Link: React.FunctionComponent<LinkPropsT> = (props) => {
  return <NextLink href={props.href}>{props.children}</NextLink>
}
