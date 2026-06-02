import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

//  FIX 1: Pointing to the precise JWKS JSON key endpoint
const jwksUrl = 'https://dev-3kmgooyedtgydmng.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })
  if (!jwt) {
    throw new Error('Invalid JWT token')
  }

  const response = await Axios.get(jwksUrl)
  const signingKeys = response.data.keys

  const signingKey = signingKeys.find(
    key => key.kid === jwt.header.kid
  )

  if (!signingKey) {
    throw new Error('Signing key not found')
  }

  //  FIX 2: Correct multi-line formatting for public key verification
  const cert = `-----BEGIN CERTIFICATE-----\n${signingKey.x5c[0]}\n-----END CERTIFICATE-----`

  const verifiedToken = jsonwebtoken.verify(
    token,
    cert,
    {
      algorithms: ['RS256']
    }
  )

  logger.info('User was authorized', {
    userId: verifiedToken.sub
  })

  return verifiedToken
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}