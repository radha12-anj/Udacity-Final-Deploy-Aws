import { getUploadUrl } from '../../fileStorage/attachmentUtils.mjs'

export async function handler(event) {
  const todoId = event.pathParameters.todoId

  const uploadUrl = await getUploadUrl(todoId)

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
}