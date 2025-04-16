// client/src/Header.js
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react"; // Import useState
import { UserContext } from "./UserContext";
import './Header.css'; // Import a dedicated CSS file for the header

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle

  useEffect(() => {
    // Fetch user profile
    fetch('http://localhost:4000/api/users/profile', {
      credentials: 'include',
    })
      .then(response => {
        // Check if response is ok and content-type is json before parsing
        if (response.ok && response.headers.get("content-type")?.includes("application/json")) {
          return response.json();
        }
        // If not ok or not json, return null or throw an error
        return null;
      })
      .then(userData => {
        // Only set user info if userData is not null
        if (userData) {
          setUserInfo(userData);
        } else {
          // If profile fetch failed or returned non-JSON, ensure user info is cleared
          setUserInfo(null);
        }
      })
      .catch(err => {
        console.error("Error fetching profile:", err);
        setUserInfo(null); // Clear user info on error
      });
  }, [setUserInfo]); // Dependency array

  function logout() {
    fetch('http://localhost:4000/api/logout', { // Corrected API endpoint if needed
      credentials: 'include',
      method: 'POST',
    })
      .then(() => {
         setUserInfo(null); // Clear user info immediately
         setIsMenuOpen(false); // Close menu on logout
         // Optionally navigate user after logout
         // navigate('/');
      })
      .catch(err => console.error("Logout error:", err));
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Use optional chaining ?. to safely access username
  const username = userInfo?.username;

  return (
    // Removed inline style, use CSS file instead
    <header className="main-header">
      <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>Keypers</Link>

       {/* Hamburger Menu Button - Hidden on Desktop */}
       <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        
          <i class={`fa-solid fa-${isMenuOpen ? 'times' : 'bars'}`}></i>
       </button>

      {/* Navigation - Add 'open' class when menu is toggled */}
      <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
        {/* Close menu when a link is clicked */}
        <Link to="/switches" onClick={() => setIsMenuOpen(false)}>Switches</Link>
        <Link to="/posts" onClick={() => setIsMenuOpen(false)}>Posts</Link>
        {username ? (
          <>
            <button onClick={logout} className="logout-button">Logout ({username})</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}