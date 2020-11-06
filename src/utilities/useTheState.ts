import { useImmer } from "use-immer"

export const useTheState = (initialState) => {
  const [value, updateValue] = useImmer(initialState)

  const setValue = (arg) => {
    if (typeof arg === "function") return updateValue(arg)
    return updateValue(() => arg)
  }

  return { value, setValue }
}
