// import "@atlaskit/css-reset/dist/bundle.css"
import "@clayui/css/lib/css/atlas.css"
import "../styles/global.css"

import * as React from "react"
import { IconContext, LinkContext } from "../comps/clay"
import { AuthWrapper } from "../comps/AuthWrapper"
import { Provider } from "next-auth/client"
import { ReactQueryDevtools } from "react-query-devtools"
import { Reset, ResetTheme } from "@atlaskit/theme"
import { BreadcrumbsProvider } from "../comps/Breadcrumbs"
import { QueryCacheProvider } from "../utilities/reactQuery"
// import { DiagnosticsProvider } from "../comps/DiagnosticsWrapper"
import { CacheProvider } from "../utilities/cache/hook"
import { Link } from "../comps/Link"

function MyApp({ Component, pageProps }) {
  return (
    // <LinkContext value={Link}>
    <IconContext.Provider value={"/icons.svg"}>
      <CacheProvider cacheName='recharger' staleTime={60000}>
        <Provider session={pageProps.session}>
          <ResetTheme.Provider>
            <Reset>
              <AuthWrapper>
                <QueryCacheProvider>
                  <>
                    {/* <DiagnosticsProvider> */}
                    <BreadcrumbsProvider>
                      <Component {...pageProps} />
                    </BreadcrumbsProvider>
                    {/* </DiagnosticsProvider> */}
                    <ReactQueryDevtools initialIsOpen={false} />
                  </>
                </QueryCacheProvider>
              </AuthWrapper>
            </Reset>
          </ResetTheme.Provider>
        </Provider>
      </CacheProvider>
    </IconContext.Provider>
    // </LinkContext>
  )
}

export default MyApp
