
import { db} from './firebase'
import { collection } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { PollResult } from './EventAdmin';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function AvailabilityTable() {
  const { eventId } = useParams();
  if (eventId === undefined) throw new Error('No event id')
  const [pollResults] = useCollection(collection(db, `events/${eventId}/pollResults`))
  const pollData: PollResult[] = pollResults?.docs.map(d => ({...d.data(), name: d.id} as PollResult)) || []
  const allDays: string[] = Array.from(new Set(pollData.flatMap(p => p.dates.split(',').map(d => d.trim())))).sort()
  
  return (<>
    <div>
    <h3>Group Availability</h3>
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
    </div>

    </>
  )
}

