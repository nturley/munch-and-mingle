import { auth, db} from './firebase'
import { collection, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { EventData } from './EventAdmin';


export default function EventList() {
  const [user, loading, error] = useAuthState(auth);
  const [events] = useCollection(query(collection(db, 'events'), where("owner", "==", user?user.uid:"illegal")))
  if (user === undefined || user === null ||  events === undefined) return <></>
  const eventData = events.docs.map((e) => ({...e.data(), id: e.id} as EventData))
  return (<>
    <h2>My Events</h2>
    <ul>
      {eventData.map((e, i) => <li key={i}><Link to={`/event/${e.id}`}>{e.name}</Link></li>)}
    </ul>
    </>
  )
}

