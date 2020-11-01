import { useState } from "react"

export const useToggle = (defaultValue: any) => {
  const [value, setValue] = useState(!!defaultValue)

  const setTrue = () => setValue((old) => true)
  const setFalse = () => setValue((old) => false)
  const toggle = () => setValue((old) => !old)
  const set = (value: any) => setValue((old) => !!value)

  return {
    value,
    set,
    setTrue,
    setFalse,
    toggle,
  }
}
