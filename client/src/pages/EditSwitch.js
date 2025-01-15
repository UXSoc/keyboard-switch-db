import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

export default function EditSwitch() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [profile, setProfile] = useState('');
  const [mount, setMount] = useState('');
  const [pins, setPins] = useState('');
  const [lubricated, setLubricated] = useState(false);
  const [manufacturer, setManufacturer] = useState('');
  const [lifetime, setLifetime] = useState('');
  const [description, setDescription] = useState('');
  const [actuationForce, setActuationForce] = useState('');
  const [bottomOutForce, setBottomOutForce] = useState('');
  const [preTravel, setPreTravel] = useState('');
  const [totalTravel, setTotalTravel] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:4000/switches/${id}`)
      .then(response => response.json())
      .then(switchData => {
        setName(switchData.name);
        setType(switchData.type);
        setProfile(switchData.profile);
        setMount(switchData.mount);
        setPins(switchData.pins);
        setLubricated(switchData.lubricated);
        setManufacturer(switchData.manufacturer);
        setLifetime(switchData.lifetime);
        setDescription(switchData.description);
        setActuationForce(switchData.actuation_force);
        setBottomOutForce(switchData.bottom_out_force);
        setPreTravel(switchData.pre_travel);
        setTotalTravel(switchData.total_travel);
      });
  }, [id]);

  async function updateSwitch(ev) {
    ev.preventDefault();
    const data = {
      name,
      type,
      profile,
      mount,
      pins: parseInt(pins),
      lubricated,
      manufacturer,
      lifetime,
      description,
      actuation_force: parseFloat(actuationForce),
      bottom_out_force: parseFloat(bottomOutForce),
      pre_travel: parseFloat(preTravel),
      total_travel: parseFloat(totalTravel),
    };
    const response = await fetch(`http://localhost:4000/switches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={`/switches/${id}`} />;
  }

  return (
    <form onSubmit={updateSwitch}>
      <input type="text" placeholder="Name" value={name} onChange={ev => setName(ev.target.value)} />
      <input type="text" placeholder="Type" value={type} onChange={ev => setType(ev.target.value)} />
      <input type="text" placeholder="Profile" value={profile} onChange={ev => setProfile(ev.target.value)} />
      <input type="text" placeholder="Mount" value={mount} onChange={ev => setMount(ev.target.value)} />
      <input type="number" placeholder="Pins" value={pins} onChange={ev => setPins(ev.target.value)} />
      <label>
        <input type="checkbox" checked={lubricated} onChange={ev => setLubricated(ev.target.checked)} />
        Lubricated
      </label>
      <input type="text" placeholder="Manufacturer" value={manufacturer} onChange={ev => setManufacturer(ev.target.value)} />
      <input type="text" placeholder="Lifetime" value={lifetime} onChange={ev => setLifetime(ev.target.value)} />
      <textarea placeholder="Description" value={description} onChange={ev => setDescription(ev.target.value)} />
      <input type="number" step="0.01" placeholder="Actuation Force (gf)" value={actuationForce} onChange={ev => setActuationForce(ev.target.value)} />
      <input type="number" step="0.01" placeholder="Bottom-Out Force (gf)" value={bottomOutForce} onChange={ev => setBottomOutForce(ev.target.value)} />
      <input type="number" step="0.01" placeholder="Pre-Travel (mm)" value={preTravel} onChange={ev => setPreTravel(ev.target.value)} />
      <input type="number" step="0.01" placeholder="Total Travel (mm)" value={totalTravel} onChange={ev => setTotalTravel(ev.target.value)} />
      <button style={{ marginTop: '5px' }}>Update Switch</button>
    </form>
  );
}
