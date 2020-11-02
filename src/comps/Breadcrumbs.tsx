import React, { useEffect } from "react"
import { BreadcrumbsItem, BreadcrumbsStateless } from "@atlaskit/breadcrumbs"
import { createContextHook } from "@kensie/create-context-hook"
import { useImmer } from "use-immer"
import { nanoid } from "nanoid"
import Link from "next/link"
import { Spacer } from "./Spacer"
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right"

type CrumbT = {
  text: string
  routeTo: string
  uid: string
}

type PreCrumbT = {
  text: string
  routeTo: string
}

type BreadcrumbsPropsT = {}

type BreadcrumbPropsT = CrumbT & {
  index: number
}

type BreadcrumbSpacerPropsT = BreadcrumbPropsT

const INITIAL_CRUMBS: CrumbT[] = [
  { text: "Home", routeTo: "/home", uid: nanoid() },
  // { text: "/ Fuck It", routeTo: "/fuckit", uid: nanoid() },
]

export const [BreadcrumbsProvider, useBreadcrumbs, BreadcrumbsContext] = createContextHook(() => {
  const [crumbs, setCrumbs] = useImmer(INITIAL_CRUMBS)

  function matchCrumb(crumb: PreCrumbT) {
    return !!crumbs.find((item) => item.routeTo === crumb.routeTo)
  }

  function addCrumb(crumb: PreCrumbT) {
    if (!matchCrumb(crumb)) {
      const crumbWithId = {
        text: crumb.text,
        routeTo: crumb.routeTo,
        uid: nanoid(),
      }

      setCrumbs((draft) => {
        draft.push(crumbWithId)
      })

      return crumbWithId
    }
  }

  function removeCrumb(crumb: CrumbT) {
    setCrumbs((draft) => {
      return draft.filter((item) => {
        return item.uid !== crumb.uid
      })
    })
  }

  return {
    crumbs,
    addCrumb,
    removeCrumb,
    setBreadcrumbs: setCrumbs,
  }
})

export function useCrumb(data: PreCrumbT) {
  const breadcrumbs = useBreadcrumbs()

  useEffect(() => {
    const crumb = breadcrumbs.addCrumb(data)
    return () => breadcrumbs.removeCrumb(crumb)
  }, [])
}

export function Breadcrumbs(props: BreadcrumbsPropsT) {
  const breadcrumbs = useBreadcrumbs()

  return (
    <BreadcrumbsStateless data-cid='Breadcrumbs'>
      {breadcrumbs.crumbs.map((crumb: CrumbT, index: number) => (
        <Breadcrumb key={crumb.routeTo} {...crumb} index={index} />
      ))}
    </BreadcrumbsStateless>
  )
}

function Breadcrumb(props: BreadcrumbPropsT) {
  return (
    <>
      <BreadcrumbSpacer {...props} />
      <Link href={props.routeTo}>
        <BreadcrumbsItem text={props.text} key={props.routeTo} />
      </Link>
    </>
  )
}

function BreadcrumbSpacer(props: BreadcrumbSpacerPropsT) {
  return props.index < 1 ? null : (
    <>
      <Spacer size={8} />
      <ChevronRightIcon label='spacer' />
      <Spacer size={8} />
    </>
  )
}
