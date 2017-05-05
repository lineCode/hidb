import Reducer from '../interfaces/reducer'

interface ReducerObj {
  [key: string]: Reducer
}
interface State {
  [key: string]: any
}

/**
 * Take a collection of reducers to produce a single reducer
 */
export default function combineReducers (reducerObj: ReducerObj): Function {
  const keys = Object.keys(reducerObj)

  return (state: State, action = {}) => {
    return keys.reduce((state, key: string) => {
      const reducer = reducerObj[key]
      return {
        ...state,
        [key]: reducer(state[key], action)
      }
    }, state)
  }
}