import { createDictionary, combineReducers, users, Reducer } from 'jiber-core'
import { createServerRoom } from './server-room'
import { sockets } from './socket/sockets'

/**
 * Top level reducer for the server
 */
export const createServerReducer = (subReducer: Reducer): Reducer => {
  const room = createServerRoom(subReducer)
  const rooms = createDictionary(room, '$roomId')
  return combineReducers({sockets, users, rooms})
}