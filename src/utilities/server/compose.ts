import { NowRequest, NowResponse } from "@vercel/node"

export type Request = NowRequest
export type Response = NowResponse

export type ContextT = {
  request: NowRequest
  response: NowResponse
  [key: string]: any
}

export type StepFunctionT = (context: ContextT) => Promise<ContextT>

export const compose = (steps: StepFunctionT[]) => {
  return async (request: NowRequest, response: NowResponse) => {
    const { body, query, url, method } = request

    let context: ContextT = {
      request,
      response,
      method,
      query,
      body,
      url,
      store: {},
      final: {
        status: 200,
      },
    }

    for (const step of steps) {
      try {
        context = await step(context)
      } catch (error) {
        console.log({ error })
        return response.status(error.status || 400).json(error)
      }
    }

    return response.status(context.final.status).json(context.final)
  }
}
