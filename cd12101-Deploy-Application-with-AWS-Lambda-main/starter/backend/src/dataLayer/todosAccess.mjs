import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand, PutCommand, DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

// Initialize the modern client
const baseClient = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(baseClient)
const table = process.env.TODOS_TABLE

export async function createTodo(item) {
  await docClient.send(new PutCommand({
    TableName: table,
    Item: item
  }))

  return item
}

export async function getTodos(userId) {
  const result = await docClient.send(new QueryCommand({
    TableName: table,
    KeyConditionExpression: 'userId = :u',
    ExpressionAttributeValues: {
      ':u': userId
    }
  }))

  return result.Items
}

export async function deleteTodo(userId, todoId) {
  await docClient.send(new DeleteCommand({
    TableName: table,
    Key: { userId, todoId }
  }))
}

export async function updateTodo(userId, todoId, updatedTodo) {
  await docClient.send(new UpdateCommand({
    TableName: table,
    Key: { userId, todoId },
    UpdateExpression: 'set #n = :name, dueDate = :d, done = :done',
    ExpressionAttributeNames: {
      '#n': 'name'
    },
    ExpressionAttributeValues: {
      ':name': updatedTodo.name,
      ':d': updatedTodo.dueDate,
      ':done': updatedTodo.done
    },
    ReturnValues: 'ALL_NEW'
  }))
}