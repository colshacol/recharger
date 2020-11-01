type ConditionsT = [any, any]

export const firstPass = (conditions: ConditionsT[]) => {
  for (const [condition, value] of conditions) {
    const isConditionFunction = typeof condition === "function"
    const isValueFunction = typeof value === "function"
    const result = isConditionFunction ? condition() : condition
    if (result) return isValueFunction ? value() : value
  }
}
