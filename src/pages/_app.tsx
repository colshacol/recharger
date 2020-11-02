import "@atlaskit/css-reset/dist/bundle.css"
import "../styles/global.css"

import { AuthWrapper } from "../comps/AuthWrapper"
import { Provider } from "next-auth/client"
import { Reset, ResetTheme } from "@atlaskit/theme"
import { BreadcrumbsProvider } from "../comps/Breadcrumbs"
import { QueryCacheProvider } from "../utilities/reactQuery"

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <AuthWrapper>
        <QueryCacheProvider>
          <ResetTheme.Provider>
            <Reset>
              <BreadcrumbsProvider>
                <Component {...pageProps} />
              </BreadcrumbsProvider>
            </Reset>
          </ResetTheme.Provider>
        </QueryCacheProvider>
      </AuthWrapper>
    </Provider>
  )
}

export default MyApp
