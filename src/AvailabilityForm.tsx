
import { useState } from 'react';
import { db} from './firebase'
import { doc, setDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { EventData } from './EventList';
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useDocument } from 'react-firebase-hooks/firestore';

export default function AvailabilityForm() {
  const { eventId } = useParams();
  if (eventId === undefined) throw new Error('No event id')
  const [value, setValue] = useState<DateObject|null|DateObject[]>(null);
  const [name, setName] = useState<string>('')
  const [myEvent] = useDocument(doc(db, "events", eventId))
  
  if (myEvent === null || myEvent === undefined) return (<></>)
  const myEventData = myEvent?.data() as EventData
  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const dates = (value as DateObject[]).map(v => v.toString())
    setDoc(doc(db, `events/${eventId}/pollResults`, name), {
      dates: dates.join(',')
    })
  }
  return (
    <div className="availability-form">
      <h3>Add Availability</h3>
      <form onSubmit={(e) => submitForm(e)}>
        <div>Your Name: <input type="text" name='name' onChange={e => setName(e.target.value)} className={'text-input'}/></div>
        <div>Available Days: <DatePicker value={value} onChange={setValue} multiple={true} minDate={myEventData.minDate} maxDate={myEventData.maxDate} placeholder="click to select dates"/></div>
        <div><button type="submit">Submit</button></div>
      </form>
    </div>
  )
}

