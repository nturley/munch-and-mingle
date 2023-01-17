
import { useState } from 'react';
import { db} from './firebase'
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { useLoaderData } from 'react-router-dom';
import { EventData, PollResult } from './EventList';
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useCollection } from 'react-firebase-hooks/firestore';

export async function eventLoader({ params}: {params: any}) {
  const docRef = doc(db, "events", params.eventId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    //const pollResults = await getDocs(collection(db, `events/${params.eventId}/pollResults`));
    //const pollData = pollResults.docs.map(d => ({...d.data(), name: d.id}))
    return {...docSnap.data(), id: params.eventId}
  } else {
    throw new Error('No such document!')
  }
}

export default function Event() {
  const [value, setValue] = useState<DateObject|null|DateObject[]>(null);
  const [name, setName] = useState<string>('')
  const myEvent = useLoaderData() as EventData

  const [pollResults] = useCollection(collection(db, `events/${myEvent.id}/pollResults`))
  const pollData: PollResult[] = pollResults?.docs.map(d => ({...d.data(), name: d.id} as PollResult)) || []
  const allDays: string[] = Array.from(new Set(pollData.flatMap(p => p.dates.split(',').map(d => d.trim())))).sort()
  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const dates = (value as DateObject[]).map(v => v.toString())
    setDoc(doc(db, `events/${myEvent.id}/pollResults`, name), {
      dates: dates.join(',')
    })
  }

  return (<>
    <h2>{myEvent.name}</h2>
    <form onSubmit={(e) => submitForm(e)}>
      <div>Name: <input type="text" placeholder="Name" name='name' onChange={e => setName(e.target.value)}/></div>
      Available Days: <DatePicker value={value} onChange={setValue} multiple={true} minDate={myEvent.minDate} maxDate={myEvent.maxDate} placeholder="click to select dates"/>
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

