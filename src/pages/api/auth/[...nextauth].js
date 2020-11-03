import NextAuth from "next-auth"
import Providers from "next-auth/providers"
// import mongojs from "mongojs"

const { MONGO_URL } = process.env
// export const mongo = mongojs(MONGO_URL)

const options = {
  debug: true,
  // database: MONGO_URL,
  events: {},

  pages: {
    signIn: "/auth/signin",
  },

  providers: [
    Providers.Auth0({
      authorizationUrl: `https://${process.env.AUTH0_DOMAIN}/authorize?response_type=code&prompt=login`,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_DOMAIN,
    }),
  ],

  jwt: {
    signingKey: process.env.JWT_SIGNING_KEY,
    secret: process.env.JWT_SECRET,
  },
}

export default (req, res) => NextAuth(req, res, options)
