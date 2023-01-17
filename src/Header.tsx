import { auth } from "./firebase"
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from "react-router-dom";

export function Header() {

    const [user, loading, error] = useAuthState(auth);

    if (loading) return <div>Loading...</div>

    if (error) return <div>Error: {error.message}</div>
  
    return (
      <div>
        <div>MBASA Munch and Mingle!</div>
        {
          user === null || user === undefined ? <Link to="/login">Sign in</Link> : <span>{user.displayName} <button onClick={() => auth.signOut()}>Sign out</button></span>
        }
      
      </div>
    )
  }
  