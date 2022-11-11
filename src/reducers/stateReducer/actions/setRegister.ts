import { ActionFunction, StateActions } from '../stateReducer'
import { NodeStatus, Register } from '../types'

export interface SetRegisterAction {
  type: StateActions.SetRegister
  payload: Register
}

const setRegister: ActionFunction<Register> = (state, payload) => {
  return {
    ...state,
    register: {
      ...state.register,
      data: payload,
    },
  }
}

export default setRegister
