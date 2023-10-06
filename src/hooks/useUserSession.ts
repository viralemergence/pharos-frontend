import { CognitoUserSession } from 'amazon-cognito-identity-js'
// import userpool from 'components/Authentication/userpool'

const getCognitoSession: () => Promise<CognitoUserSession> = () => {
  return {}
  // return new Promise((resolve, reject) => {
  //   const cognitoUser = userpool.getCurrentUser()
  //   if (!cognitoUser) {
  //     return reject('No user')
  //   } else {
  //     cognitoUser.getSession((err: unknown, session: unknown) => {
  //       if (err) {
  //         return reject(err)
  //       } else {
  //         return resolve(session as CognitoUserSession)
  //       }
  //     })
  //   }
  // })
}

export default getCognitoSession

// const useUserSession = () => {
//   const [userSession, setUserSession] = useState<CognitoUserSession | null>()

//   useEffect(() => {
//     const getSession = async () => {
//       try {
//         const session = await getCognitoSession()
//         setUserSession(session)
//       } catch (err) {
//         setUserSession(null)
//       }
//     }
//     getSession()
//   }, [])

//   return userSession
// }

// export default useUserSession
