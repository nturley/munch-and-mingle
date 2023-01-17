import './App.css'
import { useState } from 'react';
import { auth} from './firebase'
import { EmailAuthProvider, User } from "firebase/auth";
import { StyledFirebaseAuth } from 'react-firebaseui';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import EventList from './EventList';
import Event from './Event';
import { eventLoader } from './Event';


const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl : '/',
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
  ],
};




const router = createBrowserRouter([
  {
    path: "/",
    element: <EventList/>,
  },
  {
    path: "/event/:eventId",
    element: <Event/>,
    loader: eventLoader,
  },
  {
    path: "/login",
    element: <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />,
  },
]);


function App() {
  
  return (
    <div className="App">
      <RouterProvider router={router} />      
    </div>
  )
}

export default App
