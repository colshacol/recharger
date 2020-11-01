import { useImmer } from "use-immer"
import { useRef, useEffect, useState } from "react"

const lowerString = (item) => {
  return JSON.stringify(item).toLowerCase()
}

export const useStringifiedObjectSearch = (data = []) => {
  const [stringified, setStringifie] = useState([])
  const [value, updateValue] = useImmer("")
  const [original, setOriginal] = useState([])

  useEffect(() => {
    setOriginal(data)
    setStringifie(data.map(lowerString))
  }, [data.length])

  const setValue = (eventOrValue) => {
    const value = typeof eventOrValue === "string" ? eventOrValue : eventOrValue?.target?.value

    updateValue((draft) => {
      return value
    })
  }

  const filteredItems = stringified.reduce((final, item, index) => {
    const match = item.includes(value.toLowerCase())
    return match ? [...final, original[index]] : final
  }, [])

  return {
    filteredItems,
    value,
    setValue,
  }
}
