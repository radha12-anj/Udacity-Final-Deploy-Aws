import { deleteTodo } from '../../businessLogic/todos.mjs'

import winston from 'winston'
import { metricScope, Unit } from 'aws-embedded-metrics'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ]
})

export const handler = metricScope(metrics => async (event) => {

  logger.info('DeleteTodo function invoked')

  metrics.setNamespace('TodoApp')

  metrics.putMetric(
    'DeleteTodoInvocations',
    1,
    Unit.Count
  )

  try {

    const userId = event.requestContext.authorizer.principalId
    const todoId = event.pathParameters.todoId

    logger.info('Deleting todo', {
      todoId,
      userId
    })

    await deleteTodo(userId, todoId)

    logger.info('Todo deleted successfully', {
      todoId
    })

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ''
    }

  } catch (e) {

    logger.error('Error deleting todo', {
      error: e.message
    })

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'Could not delete todo'
      })
    }
  }
})