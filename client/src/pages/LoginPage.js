import '../App.css';
import './style.css';
import { useContext, useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  useEffect(() => {
    document.body.style.backgroundImage = "url('/Background.png')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center";
    document.body.style.height = "100vh";
    document.body.style.margin = "0";
    document.body.style.overflowY = "hidden";

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundPosition = "";
      document.body.style.height = "";
      document.body.style.margin = "";
      document.body.style.overflowY = "";
    };
  }, []);

  async function login(ev) {
    ev.preventDefault();
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.ok) {
      const userInfo = await response.json();
      setUserInfo(userInfo);
      setRedirect(true);
    } else {
      alert('Wrong credentials');
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-register-container">
      <form className="login-register" onSubmit={login}>
        <h1>Login</h1>
        <div className="image-container">
          <img src="/keyboard.png" alt="keyboard" className="keyboard" />
          <div className="centered">Welcome to Keypers</div>
        </div>
        <label className="input-fields">
          <p>Username</p>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={ev => setUsername(ev.target.value)}
          />
        </label>
        <label className="input-fields">
          <p>Password</p>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={ev => setPassword(ev.target.value)}
          />
        </label>
        <button>Login</button>
        <p>
          Don't have an account? <Link to="/register" className="suggested-link">Register</Link>
        </p>
      </form>
    </div>
  );
}