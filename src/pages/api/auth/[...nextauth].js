import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import mongojs from "mongojs"

const { MONGO_URL } = process.env
const mongo = mongojs(MONGO_URL)

const options = {
  debug: true,

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

  pages: {
    signIn: "/auth/signin",
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: "/auth/newUser",
  },

  events: {
    signIn: async (message) => {
      console.log("[AUTH] [SIGN_IN]")
      /* on successful sign in */
    },
    signOut: async (message) => {
      console.log("[AUTH] [SIGN_OUT]")
      /* on signout */
    },
    linkAccount: async (message) => {
      console.log("[AUTH] [LINK_ACCOUNT]")
      /* account linked to a user */
    },
    session: async (message) => {
      console.log("[AUTH] [SESSION]")
      /* session is active */
    },
    error: async (message) => {
      console.log("[AUTH] [ERROR]", message)
      /* error in authentication flow */
    },
    createUser: async (message) => {
      console.log("[AUTH] [CREATE_USER]", message)
    },
    newUser: async (message) => {
      console.log("[AUTH] [NEW_USER]", message)
    },
  },
}

export default (req, res) => NextAuth(req, res, options)
