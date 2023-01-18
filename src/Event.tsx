import { db} from './firebase'
import { doc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { EventData } from './EventList';
import { useDocument } from 'react-firebase-hooks/firestore';
import AvailabilityForm from './AvailabilityForm';
import AvailabilityTable from './AvailabilityTable';

export default function Event() {
  const { eventId } = useParams();
  if (eventId === undefined) throw new Error('No event id')
  const [myEvent] = useDocument(doc(db, "events", eventId))
  
  if (myEvent === null || myEvent === undefined) return (<></>)
  const myEventData = myEvent?.data() as EventData
  
  return (<>
    <h2>{myEventData.name}</h2>

    <AvailabilityTable/>
    <AvailabilityForm/>
    
    </>
  )
}

