export const createErrorResolver = (config: any) => {
  return (res, data = {}) => {
    const json = { data, ...config, isError: true }
    return res.status(config.status).json(json)
  }
}

export const createErrorResponse = (config: any) => {
  return {
    isError: true,
    ...config,
  }
}

export const AUTHENTICATION_FAILED = createErrorResponse({
  message: "Failed authentication.",
  type: "AUTHENTICATION_FAILED",
  status: 401,
})

export const NO_RECHARGE_API_TOKEN = createErrorResponse({
  message: "User has no rechargeApiToken set.",
  type: "NO_RECHARGE_API_TOKEN",
  status: 400,
})

export const NO_USER_FOUND = createErrorResponse({
  message: "No user found with given email.",
  type: "NO_USER_FOUND",
  status: 400,
})

export const DATABASE_ERROR = createErrorResponse({
  message: "An error occured interfacing with the database.",
  type: "DATABASE_ERROR",
  status: 400,
})
