import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function SwitchesPage() {
  const [switches, setSwitches] = useState([]);
  const { userInfo } = useContext(UserContext);
  const username = userInfo?.username;

  useEffect(() => {
    fetch('http://localhost:4000/api/switches')
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

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", margin: "20px 0" }}>
        {switches.map(switchItem => (
          <div
            key={switchItem._id}
            className="switch-card"
            style={{
              width: "23%",
              margin: "10px 0",
              textAlign: "center",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxSizing: "border-box",
              padding: "10px",
            }}
          >
            {/* Thumbnail image */}
            <img
              src={`http://localhost:4000${switchItem.thumbnail}`}
              alt={switchItem.name}
              style={{
                width: "100%", 
                maxHeight: "150px",
                objectFit: "contain",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            />

            <h2>{switchItem.name}</h2>
            <p>Type: {switchItem.type}</p>
            <Link to={`/switches/${switchItem._id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
