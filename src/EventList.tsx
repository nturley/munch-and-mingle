
import { useEffect, useState } from 'react';
import { auth, db} from './firebase'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Header } from './Header';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';


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
  const [user, loading, error] = useAuthState(auth);
  const [events] = useCollection(query(collection(db, 'events'), where("owner", "==", user?user.uid:"illegal")))
  if (user === undefined || user === null ||  events === undefined) return (<Header/>)
  const eventData = events.docs.map((e) => ({...e.data(), id: e.id} as EventData))
  return (<>
  <Header/>
    <h2>Events</h2>
    <ul>
      {eventData.map((e, i) => <li key={i}><Link to={`/event/${e.id}`}>{e.name}</Link></li>)}
    </ul>
    </>
  )
}

