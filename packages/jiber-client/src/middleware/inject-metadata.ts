import { Action, Store, Middleware, Next } from 'jiber-core'

/**
 * userId and timeMs are added to create consistency between
 * optimistic and confirmed actions
 * todo: this is too complicated, and I don't understand it any more
 */

let nextActionId = 1

export const injectMetadata: Middleware = (store: Store) => {
  return (next: Next) => (action: Action) => {
    // sanity checks
    const roomId = action.$r
    const state = store.getState()
    if (!roomId || !state.rooms[roomId]) return next(action)

    // fill in missing data
    if (!action.$id) action.$id = nextActionId++
    if (!action.$t) action.$t = new Date().getTime()

    // if there is no $u, then this action was created by the current user
    if (action.$u) {
      const room = state.rooms[roomId]
      action.$user = room.members[action.$u] || action.$user
    } else if (state.me) {
      action.$u = state.me.userId
      action.$user = state.me
    }

    return next(action)
  }
}
