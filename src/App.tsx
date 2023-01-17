import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Event from "./Event";
import EventList from "./EventList";
import { StyledFirebaseAuth } from "react-firebaseui";
import { EmailAuthProvider } from "firebase/auth";
import { auth } from "./firebase";

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl : '/',
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
  ],
};

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<EventList/>}/>
          <Route path="/login" element={<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />}/>
          <Route path="/event/:eventId" element={<Event/>}/>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
