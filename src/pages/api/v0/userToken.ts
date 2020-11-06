import { AUTHENTICATION_FAILED, DATABASE_ERROR } from "#utilities/server/responses"
import { authenticate } from "#utilities/server/authenticate"
import { compose, ContextT } from "#utilities/server/compose"
import { getUser, insertUser } from "#utilities/server/mongo"

async function verifyToken(context: ContextT) {
  const token = await authenticate({ req: context.request })

  if (!token) {
    console.log("AUTHENTICATION FAILED")
    throw AUTHENTICATION_FAILED
  }

  context.store.token = token
  return context
}

async function getUserDocument(context: ContextT) {
  const userDocument = await getUser(context.store.token.email)

  if (!document) {
    console.log("NO USER DOCUMENT")
    const error = await insertUser(context.store.token.email)
    error && console.log("DATABASE ERROR > insertUser")
    if (error) throw DATABASE_ERROR
  }

  if (userDocument.error) {
    console.log("DATABASE ERROR > getUser")
    throw DATABASE_ERROR
  }

  context.store.userDocument = userDocument
  return context
}

export default compose([verifyToken, getUserDocument])
