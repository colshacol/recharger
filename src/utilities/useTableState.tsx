import { useEffect, useRef } from "react"
import { useImmer } from "use-immer"
import mems from "mems"

const lowerString = (item) => {
  return typeof item === "string" ? item.toLowerCase() : JSON.stringify(item).toLowerCase()
}

const getMatches = mems((list, fields, input) => {
  if (!input) return list

  return list.filter((item) => {
    console.log("filtering...", input)
    return fields.reduce((final, field) => {
      if (final) return true
      return lowerString(item[field]).includes(input.toLowerCase())
    }, false)
  })
})

export const useTableState = ({ data, filterKeys, pageSize }) => {
  const timeout = useRef(null)
  const original = useRef({ data, filterKeys })

  const [state, setState] = useImmer({
    searchValue: "",
    filteredData: [],
    pages: 1,
    currentPage: 1,
  })

  const getPagination = (data) => {
    return {
      pages: Math.max(1, Math.ceil(data.length / pageSize)),
      currentPage: 1,
    }
  }

  const updateFilteredData = () => {
    setState((draft) => {
      const data = getMatches(original.current.data, original.current.filterKeys, draft.searchValue)
      Object.assign(draft, getPagination(data))
      draft.filteredData = data
    })
  }

  const goToPage = (number) => {
    console.log({ number })
    setState((draft) => {
      draft.currentPage = number
    })
  }

  const goToNextPage = () => {
    setState((draft) => {
      if (draft.pages < draft.currentPage) {
        draft.currentPage++
      }
    })
  }

  const goToPreviousPage = () => {
    setState((draft) => {
      if (draft.currentPage > 1) {
        draft.currentPage--
      }
    })
  }

  const setValue = (event) => {
    timeout.current && clearTimeout(timeout.current)

    timeout.current = setTimeout(() => {
      updateFilteredData()
      clearTimeout(timeout.current)
    }, 500)

    setState((draft) => {
      draft.searchValue = event.target.value
    })
  }

  useEffect(() => {
    data.length &&
      setState((draft) => {
        original.current.data = data
        draft.filteredData = data
        Object.assign(draft, getPagination(data))
      })
  }, [data.length])

  const startCut = (state.currentPage - 1) * pageSize
  const endCut = startCut + pageSize
  const pageData = state.filteredData.slice(startCut, endCut)
  console.log({ startCut, endCut, pageData })

  return {
    ...original.current,
    ...state,
    setValue,
    pageData,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  }
}
