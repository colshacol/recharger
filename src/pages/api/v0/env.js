import mongojs from "mongojs"
import jwt from "next-auth/jwt"
import { parseCookies } from "nookies"

const { MONGO_URL } = process.env
export const mongo = mongojs(MONGO_URL)
const users = mongo.collection("users")
const secret = process.env.JWT_SECRET
const signingKey = process.env.JWT_SIGNING_KEY

const getUserRechargeKey = (emailAddress) => {
  return new Promise((resolve, reject) => {
    users.findOne({ emailAddress }, (err, doc) => {
      err && console.log({ err })
      err && reject(err)
      console.log(doc.firstName, doc.lastName)
      return resolve(doc.rechargeApiKey)
    })
  })
}

export default async (req, res) => {
  const parsedCookies = parseCookies({ req })
  console.log(parsedCookies)

  console.log({ secret, signingKey })
  const token = await jwt.getToken({ req, secret, signingKey })
  console.log({ token })
  const rechargeKey = await getUserRechargeKey(token.email)
  console.log({ rechargeKey })
  res.json({ done: true })
}
