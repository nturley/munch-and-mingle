
import { useEffect, useState } from 'react';
import { db} from './firebase'
import { collection, getDocs } from 'firebase/firestore';
import { Header } from './Header';


export interface EventData {
  name: string
  minDate: string
  maxDate: string
  id: string
  pollResults: PollResult[]
}

export interface PollResult {
    name: string
    dates: string
}


export default function EventList() {
  const [events, setEvents] = useState<EventData[]>([])
  useEffect(() => {
    async function getEvents() {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventData = querySnapshot.docs.map(d => {
        const data = d.data()
        return {...data, id: d.id} as EventData
      })
      setEvents(eventData)
    }
    getEvents()
  }, [])
  return (<>
  <Header/>
    <h2>Events</h2>
    <ul>
      {events.map((e, i) => <li key={i}><a href={`/event/${e.id}`}>{e.name}</a></li>)}
    </ul>
    </>
  )
}

