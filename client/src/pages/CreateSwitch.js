import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function CreateSwitch() {
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
  const [thumbnail, setThumbnail] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [threeDModel, setThreeDModel] = useState(null);
  const [forceGraph, setForceGraph] = useState(null);
  const [pricingRows, setPricingRows] = useState([]);
  const [affiliateRows, setAffiliateRows] = useState([]);
  const [redirect, setRedirect] = useState(false);

  // Add new rows for pricing and affiliate links
  const addPricingRow = () => setPricingRows([...pricingRows, { vendor: '', price: '', stock: '', coupon: '' }]);
  const addAffiliateRow = () => setAffiliateRows([...affiliateRows, { vendor: '', url: '' }]);

  // Update pricing row fields
  const updatePricingRow = (index, field, value) => {
    const updatedRows = [...pricingRows];
    updatedRows[index][field] = value;
    setPricingRows(updatedRows);
  };

  // Update affiliate link row fields
  const updateAffiliateRow = (index, field, value) => {
    const updatedRows = [...affiliateRows];
    updatedRows[index][field] = value;
    setAffiliateRows(updatedRows);
  };

  // Remove pricing or affiliate row
  const removePricingRow = (index) => setPricingRows(pricingRows.filter((_, i) => i !== index));
  const removeAffiliateRow = (index) => setAffiliateRows(affiliateRows.filter((_, i) => i !== index));

  // Handle form submission
  async function createNewSwitch(ev) {
    ev.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('profile', profile);
    formData.append('mount', mount);
    formData.append('pins', pins);
    formData.append('lubricated', lubricated);
    formData.append('manufacturer', manufacturer);
    formData.append('lifetime', lifetime);
    formData.append('description', description);
    formData.append('actuation_force', actuationForce);
    formData.append('bottom_out_force', bottomOutForce);
    formData.append('pre_travel', preTravel);
    formData.append('total_travel', totalTravel);

    if (thumbnail) formData.append('thumbnail', thumbnail);
    if (threeDModel) formData.append('threeDModel', threeDModel);
    if (forceGraph) formData.append('forceGraph', forceGraph);

    // Send form data to the backend
    const response = await fetch('http://localhost:4000/api/switches', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const switchData = await response.json();

      // Upload additional images
      if (additionalImages.length > 0) {
        const imageFormData = new FormData();
        additionalImages.forEach(image => imageFormData.append('images', image));
        await fetch(`http://localhost:4000/api/switch-images/${switchData._id}`, {
          method: 'POST',
          body: imageFormData,
        });
      }

      // Submit pricing data
      if (pricingRows.length > 0) {
        await fetch(`http://localhost:4000/api/pricing/${switchData._id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pricingRows),
        });
      }

      // Submit affiliate links
      if (affiliateRows.length > 0) {
        await fetch(`http://localhost:4000/api/affiliate-links/${switchData._id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(affiliateRows),
        });
      }

      setRedirect(true);
    } else {
      console.error('Failed to create switch:', response);
    }
  }

  if (redirect) {
    return <Navigate to="/switches" />;
  }

  return (
    <form onSubmit={createNewSwitch}>
      <h2>Create New Switch</h2>

      {/* General Details */}
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={ev => setName(ev.target.value)} placeholder="Enter switch name" required />
      </div>
      <div>
        <label>Type:</label>
        <input type="text" value={type} onChange={ev => setType(ev.target.value)} placeholder="Enter switch type" required />
      </div>
      <div>
        <label>Profile:</label>
        <input type="text" value={profile} onChange={ev => setProfile(ev.target.value)} placeholder="Enter profile" />
      </div>
      <div>
        <label>Mount:</label>
        <input type="text" value={mount} onChange={ev => setMount(ev.target.value)} placeholder="Enter mount type" />
      </div>
      <div>
        <label>Pins:</label>
        <input type="number" value={pins} onChange={ev => setPins(ev.target.value)} placeholder="Enter number of pins" />
      </div>
      <div>
        <label>Lubricated:</label>
        <input type="checkbox" checked={lubricated} onChange={ev => setLubricated(ev.target.checked)} />
      </div>
      <div>
        <label>Manufacturer:</label>
        <input type="text" value={manufacturer} onChange={ev => setManufacturer(ev.target.value)} placeholder="Enter manufacturer name" />
      </div>
      <div>
        <label>Lifetime:</label>
        <input type="text" value={lifetime} onChange={ev => setLifetime(ev.target.value)} placeholder="Enter expected lifetime" />
      </div>
      <div>
        <label>Description:</label>
        <textarea value={description} onChange={ev => setDescription(ev.target.value)} placeholder="Enter switch description" />
      </div>

      {/* Forces and Travel */}
      <div>
        <label>Actuation Force (gf):</label>
        <input type="number" value={actuationForce} onChange={ev => setActuationForce(ev.target.value)} placeholder="Enter actuation force" />
      </div>
      <div>
        <label>Bottom-Out Force (gf):</label>
        <input type="number" value={bottomOutForce} onChange={ev => setBottomOutForce(ev.target.value)} placeholder="Enter bottom-out force" />
      </div>
      <div>
        <label>Pre-Travel (mm):</label>
        <input type="number" value={preTravel} onChange={ev => setPreTravel(ev.target.value)} placeholder="Enter pre-travel distance" />
      </div>
      <div>
        <label>Total Travel (mm):</label>
        <input type="number" value={totalTravel} onChange={ev => setTotalTravel(ev.target.value)} placeholder="Enter total travel distance" />
      </div>

      {/* Files Upload */}
      <div>
        <label>Thumbnail:</label>
        <input type="file" onChange={ev => setThumbnail(ev.target.files[0])} />
      </div>
      <div>
        <label>3D Model:</label>
        <input type="file" onChange={ev => setThreeDModel(ev.target.files[0])} />
      </div>
      <div>
        <label>Force Graph:</label>
        <input type="file" onChange={ev => setForceGraph(ev.target.files[0])} />
      </div>
      <div>
        <label>Additional Images:</label>
        <input type="file" multiple onChange={ev => setAdditionalImages([...ev.target.files])} />
      </div>

      {/* Pricing */}
      <h3>Pricing</h3>
      {pricingRows.map((row, index) => (
        <div key={index}>
          <label>Vendor:</label>
          <input type="text" value={row.vendor} onChange={e => updatePricingRow(index, 'vendor', e.target.value)} />
          <label>Price:</label>
          <input type="number" value={row.price} onChange={e => updatePricingRow(index, 'price', e.target.value)} />
          <label>Stock:</label>
          <input type="number" value={row.stock} onChange={e => updatePricingRow(index, 'stock', e.target.value)} />
          <label>Coupon:</label>
          <input type="text" value={row.coupon} onChange={e => updatePricingRow(index, 'coupon', e.target.value)} />
          <button type="button" onClick={() => removePricingRow(index)}>Remove Pricing</button>
        </div>
      ))}
      <button type="button" onClick={addPricingRow}>Add Pricing</button>

      {/* Affiliate Links */}
      <h3>Affiliate Links</h3>
      {affiliateRows.map((row, index) => (
        <div key={index}>
          <label>Vendor:</label>
          <input type="text" value={row.vendor} onChange={e => updateAffiliateRow(index, 'vendor', e.target.value)} />
          <label>URL:</label>
          <input type="text" value={row.url} onChange={e => updateAffiliateRow(index, 'url', e.target.value)} />
          <button type="button" onClick={() => removeAffiliateRow(index)}>Remove Link</button>
        </div>
      ))}
      <button type="button" onClick={addAffiliateRow}>Add Affiliate Link</button>

      <button style={{ marginTop: '10px' }}>Create Switch</button>
    </form>
  );
}
