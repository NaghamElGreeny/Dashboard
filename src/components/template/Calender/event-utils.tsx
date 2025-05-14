import { EventInput } from '@fullcalendar/core'

let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: todayStr

  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: '2023-09-27' + 'T12:00:00'
  },
  {
    id: createEventId(),
    title: 'meeting ',
    start: '2023-09-22' + 'T12:00:00'
  },
  {
    id: createEventId(),
    title: 'meeting ',
    start: '2023-10-22' + 'T12:00:00',
    end : '2023-10-26',
  }
]

export function createEventId() {
  return String(eventGuid++)
}
