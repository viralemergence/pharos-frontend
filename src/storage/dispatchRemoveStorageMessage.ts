import { localForageMessageStack } from "reducers/stateReducer/stateContext"
// import { StorageMessage, StorageMessageStatus } from "./synchronizeMessageQueue"
import { StateAction, StateActions } from "reducers/stateReducer/stateReducer"
// import useDispatch from "hooks/useDispatch"


// const useRemoveStorageMessage = () => {
//   const dispatch = useDispatch()

// const setStorageMessageStatus = async ({ key, status }: { key: string, status: StorageMessageStatus }) => {
//   const message = await localForageMessageStack.getItem(key) as StorageMessage
//   message.status = status
//   localForageMessageStack.setItem(key, message)
//   dispatch({ type: StateActions.SetStorageMessageStatus, payload: { key, status } })
// }

const dispatchRemoveStorageMessage = async ({
  key, dispatch }: { key: string, dispatch: React.Dispatch<StateAction> }) => {
  localForageMessageStack.removeItem(key)
  dispatch({ type: StateActions.RemoveStorageMessage, payload: key })
}


// return { removeStorageMessage }
// }

export default dispatchRemoveStorageMessage

