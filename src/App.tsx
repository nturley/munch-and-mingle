import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Event from "./Event";
import EventAdmin from "./EventAdmin";
import { StyledFirebaseAuth } from "react-firebaseui";
import { EmailAuthProvider } from "firebase/auth";
import { auth } from "./firebase";

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl : '/munch-and-mingle/',
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
  ],
};

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<EventAdmin/>}/>
          <Route path="/login" element={<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />}/>
          <Route path="/event/:eventId" element={<Event/>}/>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
