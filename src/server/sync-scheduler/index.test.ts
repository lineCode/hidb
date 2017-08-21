import { createSyncScheduler } from './index'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let calls: any[]
const state = {} as any
const store = {
  dispatch: (action: any) => calls.push(['dispatch', action]),
  getState: () => state
}
const updateRoom = (roomId: string) => calls.push(['updateRoom', roomId])
const settings = {syncInterval: 1000, maxRoomAge: 100000} as any

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const syncScheduler = createSyncScheduler(store, updateRoom, settings)
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('provide a start and stop interface', () => {
  expect(typeof syncScheduler.start).toBe('function')
  expect(typeof syncScheduler.stop).toBe('function')
})
