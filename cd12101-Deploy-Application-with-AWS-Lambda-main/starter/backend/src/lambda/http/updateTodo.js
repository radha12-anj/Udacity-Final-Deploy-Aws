import { updateTodo } from '../../businessLogic/todos.mjs'

export async function handler(event) {
  try {
    const userId = event.requestContext.authorizer.principalId
    const todoId = event.pathParameters.todoId

    const updatedTodo = JSON.parse(event.body)

    // Call business logic
    const result = await updateTodo(userId, todoId, updatedTodo)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: result
      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: error.message
      })
    }
  }
}