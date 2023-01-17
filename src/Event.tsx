
import { useEffect, useState } from 'react';
import { db} from './firebase'
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { EventData, PollResult } from './EventList';
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';

export default function Event() {
  const { eventId } = useParams();
  if (eventId === undefined) throw new Error('No event id')
  const [value, setValue] = useState<DateObject|null|DateObject[]>(null);
  const [name, setName] = useState<string>('')
  const [myEvent] = useDocument(doc(db, "events", eventId))
  const [pollResults] = useCollection(collection(db, `events/${eventId}/pollResults`))
  
  if (myEvent === null || myEvent === undefined) return (<></>)
  const myEventData = myEvent?.data() as EventData
  const pollData: PollResult[] = pollResults?.docs.map(d => ({...d.data(), name: d.id} as PollResult)) || []
  const allDays: string[] = Array.from(new Set(pollData.flatMap(p => p.dates.split(',').map(d => d.trim())))).sort()
  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const dates = (value as DateObject[]).map(v => v.toString())
    setDoc(doc(db, `events/${eventId}/pollResults`, name), {
      dates: dates.join(',')
    })
  }
  return (<>
    <h2>{myEventData.name}</h2>
    <form onSubmit={(e) => submitForm(e)}>
      <div>Your Name: <input type="text" placeholder="Name" name='name' onChange={e => setName(e.target.value)}/></div>
      Available Days: <DatePicker value={value} onChange={setValue} multiple={true} minDate={myEventData.minDate} maxDate={myEventData.maxDate} placeholder="click to select dates"/>
      <div><button type="submit">Submit</button></div>
    </form>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          {allDays.map((d: string) => <th key={d}>{d.substring(5)}</th>)}
        </tr>
        </thead>
        <tbody>
        {
          pollData.map(p =>
            <tr key={p.name}>
              <td>{p.name}</td>
              {
                allDays.map(d => <td key={d}>{p.dates.split(',').includes(d)?'✅':'❌'}</td>)
              }
            </tr>)}
        </tbody>
    </table>
    </>
  )
}

