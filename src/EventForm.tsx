import { useState } from "react";
import { auth, db } from "./firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useAuthState } from "react-firebase-hooks/auth";

export default function EventForm() {
  const [user, loading, error] = useAuthState(auth);
  const [minDate, setMinDate] = useState<DateObject | null | DateObject[]>(
    null
  );
  const [name, setName] = useState<string>("");
  const [maxDate, setMaxDate] = useState<DateObject | null | DateObject[]>(
    null
  );

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const eventId = "testEvent";
    addDoc(collection(db, 'events'), {
      owner: user?.uid,
      minDate: (minDate as DateObject).toString(),
      maxDate: (maxDate as DateObject).toString(),
      name: name,
    });
  }
  return (
    <div className="availability-form">
      <h3>Create New Event</h3>
      <form onSubmit={(e) => submitForm(e)}>
        <div>
          Event Name:{" "}
          <input
            type="text"
            name="name"
            onChange={(e) => setName(e.target.value)}
            className={"text-input"}
          />
        </div>
        <div>
          Min Date:{" "}
          <DatePicker
            value={minDate}
            onChange={setMinDate}
            placeholder="click to select date"
          />
        </div>
        <div>
          Max Date:{" "}
          <DatePicker
            value={maxDate}
            onChange={setMaxDate}
            placeholder="click to select date"
          />
        </div>

        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
