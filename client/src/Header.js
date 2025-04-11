// client/src/Header.js
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch('http://localhost:4000/api/users/profile', {
      credentials: 'include',
    })
      .then(response => response.json())
      .then(userInfo => {
        setUserInfo(userInfo);
      })
      .catch(err => {
        // Handle error if needed
        console.error("Error fetching profile:", err);
      });
  }, [setUserInfo]);

  function logout() {
    fetch('http://localhost:4000/api/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header style={{ padding: "2em 2.5em" }}>
      <Link to="/" className="logo">Keypers</Link>
      <nav className="header-style">
        <Link to="/switches">Switches</Link>
        <Link to="/posts">Posts</Link>
        {username ? (
          <>
            <a onClick={logout} style={{ cursor: "pointer" }}>Logout ({username})</a>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
