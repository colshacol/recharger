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

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <AuthWrapper>
        <QueryCacheProvider>
          <>
            <DiagnosticsProvider>
              <ResetTheme.Provider>
                <Reset>
                  <BreadcrumbsProvider>
                    <Component {...pageProps} />
                  </BreadcrumbsProvider>
                </Reset>
              </ResetTheme.Provider>
            </DiagnosticsProvider>
            <ReactQueryDevtools initialIsOpen />
          </>
        </QueryCacheProvider>
      </AuthWrapper>
    </Provider>
  )
}

export default MyApp
