import { Action } from '../../core/index'
import ClientState from '../interfaces/client-state'

export const createResendPending = (
  sendAction: (socket: WebSocket, action: Action) => void,
  getState: () => ClientState
) => {
  return (socket: WebSocket, roomId: string) => {
    const state = getState()
    const room = state.rooms[roomId]
    if (!room) return
    room.optimisticActions.forEach(action => sendAction(socket, action))
  }
}
