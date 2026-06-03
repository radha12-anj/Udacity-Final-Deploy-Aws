import { getTodos } from '../../businessLogic/todos.mjs'

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

  logger.info('GetTodos function invoked')

  metrics.setNamespace('TodoApp')

  metrics.putMetric(
    'GetTodosInvocations',
    1,
    Unit.Count
  )

  try {

    const userId = event.requestContext.authorizer.principalId

    logger.info('Fetching todos for user', {
      userId
    })

    const items = await getTodos(userId)

    logger.info('Todos fetched successfully', {
      count: items.length
    })

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

  } catch (error) {

    logger.error('Error fetching todos', {
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