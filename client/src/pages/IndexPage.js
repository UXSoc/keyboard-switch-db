import { useEffect, useState } from "react";

export default function IndexPage() {
  const [switches, setSwitches] = useState([]);
  const [filteredSwitches, setFilteredSwitches] = useState([]);
  const [filter, setFilter] = useState({
    type: "",
    profile: "",
    mount: "",
  });

  useEffect(() => {
    fetch('http://localhost:4000/switches')
      .then(response => response.json())
      .then(data => {
        setSwitches(data);
        setFilteredSwitches(data);
      });
  }, []);

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  }

  useEffect(() => {
    let filtered = switches;
    if (filter.type) {
      filtered = filtered.filter(sw => sw.type.toLowerCase().includes(filter.type.toLowerCase()));
    }
    if (filter.profile) {
      filtered = filtered.filter(sw => sw.profile.toLowerCase().includes(filter.profile.toLowerCase()));
    }
    if (filter.mount) {
      filtered = filtered.filter(sw => sw.mount.toLowerCase().includes(filter.mount.toLowerCase()));
    }
    setFilteredSwitches(filtered);
  }, [filter, switches]);

  return (
    <div>
      <h1>Switch Gallery</h1>
      <div>
        <label>
          Type:
          <input
            type="text"
            name="type"
            value={filter.type}
            onChange={handleFilterChange}
            placeholder="e.g., Linear"
          />
        </label>
        <label>
          Profile:
          <input
            type="text"
            name="profile"
            value={filter.profile}
            onChange={handleFilterChange}
            placeholder="e.g., Low Profile"
          />
        </label>
        <label>
          Mount:
          <input
            type="text"
            name="mount"
            value={filter.mount}
            onChange={handleFilterChange}
            placeholder="e.g., PCB"
          />
        </label>
      </div>
      <div className="gallery">
        {filteredSwitches.map(sw => (
          <div key={sw._id} className="switch-card">
            <h2>{sw.name}</h2>
            <p>Type: {sw.type}</p>
            <p>Profile: {sw.profile}</p>
            <p>Mount: {sw.mount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
