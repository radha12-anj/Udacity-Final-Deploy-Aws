import { deleteTodo } from '../../businessLogic/todos.mjs'

export async function handler(event) {
  const userId = event.requestContext.authorizer.principalId
  const todoId = event.pathParameters.todoId

  await deleteTodo(userId, todoId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }
}
