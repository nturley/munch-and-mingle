import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "@blueprintjs/datetime2/lib/css/blueprint-datetime2.css";

import PocketBase from "pocketbase";
import {Record, Admin} from "pocketbase";
import { useEffect, useState } from "react";
import { HashRouter, Link, Route, Routes, useParams } from "react-router-dom";
import {
  Alignment,
  Button,
  Card,
  HTMLTable,
  Icon,
  InputGroup,
  Intent,
  Navbar,
  Spinner,
} from "@blueprintjs/core";
import { DateRangeInput2 } from "@blueprintjs/datetime2";
import DatePicker, { DateObject } from "react-multi-date-picker";

const pb = new PocketBase("https://broad-wolf.pockethost.io");
// nturley
// QmxA2jehPYhWbeC




function NewEventForm() {
  const [eventName, setEventName] = useState("");
  const [minDate, setMinDate] = useState<Date | undefined>(undefined);
  const [maxDate, setMaxDate] = useState<Date | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    pb.collection("events").create({ event_name: eventName, minDate, maxDate });
    setEventName("");
    setMinDate(undefined);
    setMaxDate(undefined);
  };

  return (
    <Card>
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <InputGroup
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
        <DateRangeInput2
          formatDate={(d) => d.toDateString()}
          parseDate={(d) => new Date(d)}
          shortcuts={false}
          singleMonthOnly={true}
          value={[minDate || null, maxDate || null]}
          onChange={(d) => {
            setMinDate(d[0] || undefined);
            setMaxDate(d[1] || undefined);
          }}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Card>
  );
}

function shortDateFormat(date: Date) {
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

function EventList() {
  
  function refreshEvents() {
    pb.collection("events")
      .getFullList(200, { sort: "-created" })
      .then((records) => {
        setEvents(records);
      });
  }

  function deleteEvent(eventId: string) {
    pb.collection("events").delete(eventId);
  }

  const [events, setEvents] = useState<any[] | null>(null);

  useEffect(() => {
    refreshEvents();
    pb.collection("events").subscribe("*", function (e) {
      refreshEvents();
    });
    return () => {
      pb.collection("events").unsubscribe("*");
    };
  }, []);


  if (events === null) return <Spinner />;
  if (events.length === 0) return <></>
  return (
    <Card>
      <h2>Events</h2>
      <HTMLTable compact={true} interactive={true}>
        <thead>
          <tr>
            <th></th>
            <th>Event Name</th>
            <th>Created</th>
            <th>Min Date</th>
            <th>Max Date</th>
          </tr>
        </thead>
        <tbody>
          {events.map((record) => (
            <tr key={record.id}>
              <td><Button small={true} intent={Intent.DANGER} onClick={e => deleteEvent(record.id)}><Icon icon="delete"/></Button></td>
              <td>
                <Link to={`/event/${record.id}`}>{record.event_name}</Link>
              </td>
              <td>{shortDateFormat(new Date(record.created))}</td>
              <td>{shortDateFormat(new Date(record.minDate))}</td>
              <td>{shortDateFormat(new Date(record.maxDate))}</td>
            </tr>
          ))}
        </tbody>
      </HTMLTable>
    </Card>
  );
}

function EventManager() {
  /*
  if (!pb.authStore.isValid) {
    return <LoginForm/>
  }*/
  return (
    <>
      <EventList />
      <NewEventForm />
    </>
  );
}

function EventView() {
  const [event, setEvent] = useState<any>(null);
  const { eventId } = useParams();
  if (eventId === undefined) throw new Error("No event id");
  useEffect(() => {
    pb.collection("events")
      .getOne(eventId)
      .then((record) => {
        setEvent(record);
      });
  }, []);
  if (event === null) return <Spinner />;
  return (
    <>
      <h2 style={{marginBottom: '0'}}>{event.event_name}</h2>
      <h4 style={{marginTop: '0'}}>
        {shortDateFormat(new Date(event.minDate))} -{" "}
        {shortDateFormat(new Date(event.maxDate))}
      </h4>
      <Availability event_id={event.id} />
      <AddAvailabilityForm event_id={event.id} minDate={event.minDate} maxDate={event.maxDate}/>
    </>
  );
}

function AddAvailabilityForm({event_id, minDate, maxDate}: {event_id: string, minDate: Date, maxDate: Date}) {
  const [dates, setDates] = useState<null|DateObject[]>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (dates === null) return;
    pb.collection("availability").create({ event_id, name, dates:dates.join(','), phone });
  };
  return <Card>
    <h3>Add Your Availability</h3>
    <form onSubmit={handleSubmit}>
      <InputGroup placeholder="Your name" value={name} onChange={v => setName(v.target.value)}/>
      <DatePicker
        value={dates}
        onChange={v => setDates(v as DateObject[])}
        multiple={true}
        minDate={minDate}
        maxDate={maxDate}
        placeholder="Click to select dates"
        style={{height: '30px', padding: '0 10px', border: '1px solid #ccc', borderRadius: '2px'}}
      />
      <InputGroup placeholder="Phone number" value={phone} onChange={v => setPhone(v.target.value)}/>
      <Button type="submit">Submit</Button>
    </form>
  </Card>;
}

function Availability({event_id}: {event_id: string}) {
  const [availability, setAvailability] = useState<any[] | null>(null);
  useEffect(() => {
    refreshAvailability();
    pb.collection("availability").subscribe("*", function (e) {
      refreshAvailability();
    }
    );
  }, []);
  function refreshAvailability() {
    pb.collection("availability")
      .getFullList(200, {
        filter: `event_id = "${event_id}"`,
        sort: "+created"
      })
      .then((records) => {
        const map = Object.fromEntries(records.map((r: any) => [r.name, r]))
        setAvailability(Object.values(map));
      });
  }

  if (availability === null) return <Spinner />;
  if (availability.length === 0) return <></>;
  const allDates = Array.from(new Set(availability?.flatMap((a: any) => a.dates.split(',')) || [])).sort();

  return <Card style={{maxWidth:'100%', overflowX:'auto'}}>
    <h3>Group Availability</h3>
    <HTMLTable compact={true}>
      <thead>
        <tr>
          <th>Name</th>
          {allDates.map((d: string) => <th key={d}>{shortDateFormat(new Date(d))}</th>)}
        </tr>
      </thead>
      <tbody>
        {availability?.map((a: any) => <tr key={a.id}>
          <td>{a.name}</td>
          {allDates.map((d: string) => <td key={d}>{a.dates.split(',').includes(d) ? '✅' : '❌'}</td>)}
        </tr>)}
      </tbody>
    </HTMLTable>
    <h3>Phone Numbers</h3>
    <ul>
      {availability?.map((a: any) => <li key={a.id}>{a.name}: {a.phone}</li>)}
    </ul>
  </Card>;
}

function LoginForm() {
  return <h2>Login Form</h2>
}

function App() {
  const [currentUser, setCurrentUser] = useState<Record | Admin | null>(null);
  pb.authStore.onChange(() => {
    setCurrentUser(pb.authStore.model);
  });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <HashRouter>
        <Navbar>
          <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading>
              <Icon icon="calendar" /> <Link to="/">Event Scheduler</Link>
            </Navbar.Heading>
            <Navbar.Divider />
            {/*currentUser && <Navbar.Heading>{currentUser.name}</Navbar.Heading>*/}
          </Navbar.Group>
        </Navbar>
        <Routes>
          <Route path="/" element={<EventManager />} />
          <Route path="/event/:eventId" element={<EventView />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
