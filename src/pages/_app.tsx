import "@atlaskit/css-reset/dist/bundle.css"
import "../styles/global.css"

import * as React from "react"
import { AuthWrapper } from "../comps/AuthWrapper"
import { Provider } from "next-auth/client"
import { ReactQueryDevtools } from "react-query-devtools"
import { Reset, ResetTheme } from "@atlaskit/theme"
import { BreadcrumbsProvider } from "../comps/Breadcrumbs"
import { QueryCacheProvider } from "../utilities/reactQuery"
import { DiagnosticsProvider } from "../comps/DiagnosticsWrapper"
import { CacheProvider } from "../utilities/cache/hook"

function MyApp({ Component, pageProps }) {
  return (
    <CacheProvider cacheName='recharger' staleTime={60000}>
      <Provider session={pageProps.session}>
        <ResetTheme.Provider>
          <Reset>
            <AuthWrapper>
              <QueryCacheProvider>
                <>
                  <DiagnosticsProvider>
                    <BreadcrumbsProvider>
                      <Component {...pageProps} />
                    </BreadcrumbsProvider>
                  </DiagnosticsProvider>
                  <ReactQueryDevtools initialIsOpen />
                </>
              </QueryCacheProvider>
            </AuthWrapper>
          </Reset>
        </ResetTheme.Provider>
      </Provider>
    </CacheProvider>
  )
}

export default MyApp
