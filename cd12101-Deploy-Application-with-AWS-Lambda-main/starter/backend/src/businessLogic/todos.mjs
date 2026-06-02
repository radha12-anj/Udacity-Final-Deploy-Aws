import { v4 as uuidv4 } from 'uuid'
import {
  createTodo as createTodoInDB,
  getTodos as getTodosFromDB,
  deleteTodo as deleteTodoInDB,
  updateTodo as updateTodoInDB
} from '../dataLayer/todosAccess.mjs'

const bucketName = process.env.ATTACHMENTS_S3_BUCKET

export async function createTodo(todo, userId) {
  console.log('Bucket Name:', process.env.ATTACHMENTS_S3_BUCKET)

  const name = todo?.name?.trim()
  const dueDate = todo?.dueDate

  if (!name) {
    throw new Error('Todo name is required')
  }

  const todoId = uuidv4()

  return await createTodoInDB({
    userId,
    todoId,
    name,
    dueDate,
    done: false,
    createdAt: new Date().toISOString(),
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
  })
}

export async function getTodos(userId) {
  return await getTodosFromDB(userId)
}

export async function deleteTodo(userId, todoId) {
  return await deleteTodoInDB(userId, todoId)
}

export async function updateTodo(userId, todoId, updatedTodo) {
  return await updateTodoInDB(userId, todoId, updatedTodo)
}