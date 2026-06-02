import { getTodos } from '../../businessLogic/todos.mjs'

export async function handler(event) {
  const userId = event.requestContext.authorizer.principalId

  const items = await getTodos(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items
    })
  }
}