import wretch from "wretch"
import fetch from "node-fetch"
import FormData from "form-data"
import { URLSearchParams } from "url"

wretch().polyfills({
  fetch,
  FormData,
  URLSearchParams,
})

export { wretch }
