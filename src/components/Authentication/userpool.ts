import { CognitoUserPool } from 'amazon-cognito-identity-js'

const poolData = {
  UserPoolId: 'us-east-2_IfMtrhdEW',
  ClientId: '5m5c0obcj34d5jd06oufjh5omb',
  // UserPoolId: process.env.GATSBY_USER_POOL_ID,
  // ClientId: process.env.GATSBY_CLIENT_ID,
}

export default new CognitoUserPool(poolData)
