import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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

  async function register(ev) {
    ev.preventDefault();
    const response = await fetch('http://localhost:4000/api/users/register', { // Updated route with '/api/users'
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 200) {
      alert('Registration successful');
    } else {
      alert('Registration failed');
    }
  }

  return (
    <div className="login-register-container">
      <form className="login-register" onSubmit={register}>
        <h1>Register</h1>
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
        <button>Register</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
