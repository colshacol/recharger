import "@atlaskit/css-reset/dist/bundle.css"
import "../styles/global.css"

import { Reset, ResetTheme } from "@atlaskit/theme"
import { BreadcrumbsProvider } from "../comps/Breadcrumbs"
import { QueryCacheProvider } from "../utilities/reactQuery"

function MyApp({ Component, pageProps }) {
  return (
    <QueryCacheProvider>
      <ResetTheme.Provider>
        <Reset>
          <BreadcrumbsProvider>
            <Component {...pageProps} />
          </BreadcrumbsProvider>
        </Reset>
      </ResetTheme.Provider>
    </QueryCacheProvider>
  )
}

export default MyApp
