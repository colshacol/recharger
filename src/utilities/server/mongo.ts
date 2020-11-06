import Recharge from "recharge-api-node"
import mongojs from "mongojs"
import jwt from "next-auth/jwt"
import isEmpty from "is-empty"
import monk from "monk"
import { of } from "await-of"

const { MONGO_URL } = process.env
export const database = monk(MONGO_URL)
const users = database.get("users")

export async function getUser(email) {
  const [document, error] = await of(users.findOne({ email }))
  return error ? { error } : document
}

export async function insertUser(user) {
  const [document, error] = await of(users.insert(user))
  return error ? { error } : document
}
