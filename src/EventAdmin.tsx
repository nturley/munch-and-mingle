import { Header } from './Header';
import EventList from './EventList';
import EventForm from './EventForm';

export interface EventData {
  name: string
  minDate: string
  maxDate: string
  id: string
}

export interface PollResult {
    name: string
    dates: string
}


export default function EventAdmin() {
  return (<>
    <Header/>
    <EventList/>
    <EventForm/>
    </>
  )
}

