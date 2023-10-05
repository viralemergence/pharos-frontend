import { CognitoUserPool } from 'amazon-cognito-identity-js'

const poolData = {
  UserPoolId: process.env.GATSBY_USER_POOL_ID!,
  ClientId: process.env.GATSBY_CLIENT_ID!,
}

export default new CognitoUserPool(poolData)
