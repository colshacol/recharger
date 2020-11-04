import _wretch from "wretch"
import fetch from "node-fetch"
import FormData from "form-data"
import { URLSearchParams } from "url"

_wretch().polyfills({
  fetch,
  FormData,
  URLSearchParams,
})

const wretch = _wretch().url(process.env.APP_URL)

export { wretch }
