import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {UserContext} from "../UserContext";
export default function SwitchesPage() {
  const [switches, setSwitches] = useState([]);
  const {userInfo} = useContext(UserContext);
  const username = userInfo?.username;
  useEffect(() => {
    fetch('http://localhost:4000/switches')
      .then(res => res.json())
      .then(data => setSwitches(data));
  }, []);

  return (
    <div>
      <h1>Switch Database</h1>
      {username && (
          <>
            <Link to="/switches/create">Create New Switch</Link>
          </>
        )}
      
      <div>
        {switches.map(switchItem => (
          <div key={switchItem._id} className="switch-card">
            <h2>{switchItem.name}</h2>
            <p>Type: {switchItem.type}</p>
            <p>Profile: {switchItem.profile}</p>
            <p>Mount: {switchItem.mount}</p>
            <Link to={`/switches/${switchItem._id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
