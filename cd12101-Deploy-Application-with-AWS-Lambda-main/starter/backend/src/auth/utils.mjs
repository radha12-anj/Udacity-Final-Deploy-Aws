import jsonwebtoken from 'jsonwebtoken'

export function parseUserId(token) {
  const decoded = jsonwebtoken.decode(token)
  return decoded.sub
}