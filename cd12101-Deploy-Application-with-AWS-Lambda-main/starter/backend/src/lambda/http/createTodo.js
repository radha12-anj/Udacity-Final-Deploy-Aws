import { createTodo } from '../../businessLogic/todos.mjs'

export async function handler(event) {
  const todo = JSON.parse(event.body)
  const userId = event.requestContext.authorizer.principalId

  const newItem = await createTodo(todo, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}
