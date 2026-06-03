import { updateTodo } from '../../businessLogic/todos.mjs'

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

  logger.info('UpdateTodo function invoked')

  metrics.setNamespace('TodoApp')

  metrics.putMetric(
    'UpdateTodoInvocations',
    1,
    Unit.Count
  )

  try {

    const userId = event.requestContext.authorizer.principalId
    const todoId = event.pathParameters.todoId

    logger.info('Updating todo', {
      userId,
      todoId
    })

    const updatedTodo = JSON.parse(event.body)

    logger.info('Update payload received', {
      updatedTodo
    })

    const result = await updateTodo(userId, todoId, updatedTodo)

    logger.info('Todo updated successfully', {
      item: result
    })

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

    logger.error('Error updating todo', {
      error: error.message
    })

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
})