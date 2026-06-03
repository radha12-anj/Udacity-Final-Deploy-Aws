import AWSXRay from 'aws-xray-sdk-core'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb'

// Enable X-Ray for AWS SDK v3
const baseClient = AWSXRay.captureAWSv3Client(new DynamoDBClient({}))
const docClient = DynamoDBDocumentClient.from(baseClient)

const table = process.env.TODOS_TABLE

// CREATE TODO
export async function createTodo(item) {
  await docClient.send(
    new PutCommand({
      TableName: table,
      Item: item
    })
  )

  return item
}

// GET TODOS
export async function getTodos(userId) {
  const result = await docClient.send(
    new QueryCommand({
      TableName: table,
      KeyConditionExpression: 'userId = :u',
      ExpressionAttributeValues: {
        ':u': userId
      }
    })
  )

  return result.Items
}

// DELETE TODO
export async function deleteTodo(userId, todoId) {
  await docClient.send(
    new DeleteCommand({
      TableName: table,
      Key: { userId, todoId }
    })
  )
}

// UPDATE TODO (🔥 FIXED - includes attachmentUrl)
export async function updateTodo(userId, todoId, updatedTodo) {
  await docClient.send(
    new UpdateCommand({
      TableName: table,
      Key: { userId, todoId },

      UpdateExpression:
        'set #n = :name, dueDate = :d, done = :done, attachmentUrl = :a',

      ExpressionAttributeNames: {
        '#n': 'name'
      },

      ExpressionAttributeValues: {
        ':name': updatedTodo.name,
        ':d': updatedTodo.dueDate,
        ':done': updatedTodo.done,
        ':a': updatedTodo.attachmentUrl || null
      },

      ReturnValues: 'ALL_NEW'
    })
  )
}