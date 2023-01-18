import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

export function Header() {
  const [user, loading, error] = useAuthState(auth);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (user === null || user === undefined)
    return (
      <div className="auth-header">
        <Link to="/login">Sign in</Link>
      </div>
    );
  return (
    <div className="auth-header">
      <span>{user.displayName}</span>{" "}
      <button onClick={() => auth.signOut()}>Sign out</button>
    </div>
  );
}
