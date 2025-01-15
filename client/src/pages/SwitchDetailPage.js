import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function SwitchDetailPage() {
  const { id } = useParams();
  const [switchData, setSwitchData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/switches/${id}`)
      .then(res => res.json())
      .then(data => setSwitchData(data));
  }, [id]);

  if (!switchData) return <div>Loading...</div>;

  return (
    <div>
      <h1>{switchData.name}</h1>
      <p>Type: {switchData.type}</p>
      <p>Profile: {switchData.profile}</p>
      <p>Mount: {switchData.mount}</p>
      <p>Manufacturer: {switchData.manufacturer}</p>
      <p>Lifetime: {switchData.lifetime}</p>
      <p>Description: {switchData.description}</p>
      <p>Actuation Force: {switchData.actuation_force} gf</p>
      {/* Add more details as needed */}
    </div>
  );
}
