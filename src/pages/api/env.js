import mongojs from "mongojs"
import jwt from "next-auth/jwt"

const { MONGO_URL } = process.env
export const mongo = mongojs(MONGO_URL)
const users = mongo.collection("users")
const secret = process.env.JWT_SECRET

const getUserRechargeKey = (emailAddress) => {
  return new Promise((resolve, reject) => {
    users.findOne({ emailAddress }, (err, doc) => {
      console.log({ doc })
      err && console.log({ err })
      err && reject(err)
      return resolve(doc.rechargeApiKey)
    })
  })
}

export default async (req, res) => {
  console.log({ secret })
  const token = await jwt.getToken({ req, secret })
  console.log({ token })
  const rechargeKey = await getUserRechargeKey(token.email)
  console.log({ rechargeKey })
  res.json({ done: true })
}
