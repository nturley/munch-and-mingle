import { User } from "firebase/auth"
import { auth } from "./firebase"
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

export function Header() {

    const [user, loading, error] = useAuthState(auth);

    if (loading) return <div>Loading...</div>

    if (error) return <div>Error: {error.message}</div>
  
    return (
      <div>
        <div>MBASA Munch and Mingle!</div>
        {
          user === null || user === undefined ? <a href="/login">Sign in</a> : <span>{user.displayName} <button onClick={() => auth.signOut()}>Sign out</button></span>
        }
      
      </div>
    )
  }
  