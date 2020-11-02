import NextAuth from "next-auth"
import Providers from "next-auth/providers"
// import mongojs from "mongojs"

const { MONGO_URL } = process.env
// export const mongo = mongojs(MONGO_URL)

const options = {
  debug: true,
  pages: {
    signIn: "/auth/signin",
    // signOut: "/auth/signout",
    // error: "/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: "/auth/verify-request", // (used for check email message)
    // newUser: null, // If set, new users will be directed here on first sign in
  },
  providers: [
    Providers.Auth0({
      authorizationUrl: `https://${process.env.AUTH0_DOMAIN}/authorize?response_type=code&prompt=login`,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_DOMAIN,
    }),

    // Providers.Email({
    //   service: "Gmail",
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // }),
  ],

  jwt: {
    secret: process.env.JWT_SECRET,
  },

  // database: 'mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD@127.0.0.1:3306/database_name'
  // database: MONGO_URL,

  events: {
    // signIn: async (message) => {
    //   console.log("signIn", message)
    // },
    // signOut: async (message) => {
    //   console.log("signOut", message)
    // },
    // createUser: async (message) => {
    //   console.log("createUser", message)
    // },
    // linkAccount: async (message) => {
    //   console.log("linkAccount", message)
    // },
    // session: async (message) => {
    //   console.log("session", message)
    // },
    // error: async (message) => {
    //   console.log("error", message)
    // },
  },
}

export default (req, res) => NextAuth(req, res, options)
