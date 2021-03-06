import { HiDBRedisSettings } from './interfaces'
import { getConnection } from './get-connection'

export class Receiver {
  private next: Function
  private lastActionTime: string = '0'
  private host: string
  private port: number
  private docId: string
  private active: boolean = false

  constructor (settings: HiDBRedisSettings, next: Function) {
    const { host, port, docId } = settings
    this.next = next
    this.host = host
    this.port = port
    this.docId = docId
  }

  public start = (lastActionTime: string = '0') => {
    this.lastActionTime = lastActionTime
    this.active = true
    this.fetchLoop()
  }

  public stop = () => {
    this.active = false
  }

  private fetch = async () => {
    const conn = getConnection(this.host, this.port, `${this.docId}-receiver`)
    const results: any = await conn.xread(
      'BLOCK', '1000', 'COUNT', '100', 'STREAMS', this.docId, this.lastActionTime
    )

    if (!this.active) return
    if (!results) return

    results.forEach((result: any) => {
      const actionPacks = result[1]

      actionPacks.forEach((actionPack: any) => {
        const entryId = actionPack[0]
        const strAction = actionPack[1][1]
        const action = JSON.parse(strAction)
        action.doc = this.docId
        action.time = Number(entryId.split('-')[0])
        this.lastActionTime = entryId
        this.next(action)
      })
    })
  }

  private fetchLoop = () => {
    if (!this.active) return
    this.fetch()
      .then(() => setTimeout(this.fetchLoop, 1))
      .catch(() => setTimeout(this.fetchLoop, 1000))
  }
}
