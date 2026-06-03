 import { createTodo } from '../../businessLogic/todos.mjs'

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

  logger.info('CreateTodo function invoked')

  metrics.setNamespace('TodoApp')

  metrics.putMetric(
    'CreateTodoInvocations',
    1,
    Unit.Count
  )

  try {

    const todo = JSON.parse(event.body)

    logger.info('Todo body parsed', {
      todo
    })

    const userId = event.requestContext.authorizer.principalId

    logger.info('Creating todo for user', {
      userId
    })

    const newItem = await createTodo(todo, userId)

    logger.info('Todo created successfully', {
      item: newItem
    })

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

  } catch (e) {

    logger.error('Error creating todo', {
      error: e.message
    })

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'Could not create todo'
      })
    }
  }
}) 
