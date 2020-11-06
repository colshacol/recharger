import jwt from "next-auth/jwt"

export const authenticate = async (req) => {
  const secret = process.env.JWT_SECRET
  const signingKey = process.env.JWT_SIGNING_KEY
  const token = await jwt.getToken({ req, secret, signingKey })
  return token
}
