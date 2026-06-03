import { getUploadUrl } from '../../fileStorage/attachmentUtils.mjs'

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

  logger.info('GenerateUploadUrl function invoked')

  metrics.setNamespace('TodoApp')

  metrics.putMetric(
    'GenerateUploadUrlInvocations',
    1,
    Unit.Count
  )

  try {

    const todoId = event.pathParameters.todoId

    logger.info('Generating upload URL', {
      todoId
    })

    const uploadUrl = await getUploadUrl(todoId)

    logger.info('Upload URL generated successfully', {
      todoId
    })

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl
      })
    }

  } catch (error) {

    logger.error('Error generating upload URL', {
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