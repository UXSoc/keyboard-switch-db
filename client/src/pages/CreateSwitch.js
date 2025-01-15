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
    const [thumbnail, setThumbnail] = useState('');
    const [additionalImages, setAdditionalImages] = useState([]);
    const [threeDModel, setThreeDModel] = useState(null);
    const [forceGraph, setForceGraph] = useState(null);
    const [pricingRows, setPricingRows] = useState([]);
    const [affiliateRows, setAffiliateRows] = useState([]);
    const [redirect, setRedirect] = useState(false);
  
    const addPricingRow = () => setPricingRows([...pricingRows, { vendor: '', price: '', stock: '', coupon: '' }]);
    const removePricingRow = (index) => setPricingRows(pricingRows.filter((_, i) => i !== index));
    const updatePricingRow = (index, field, value) => {
      const updatedRows = [...pricingRows];
      updatedRows[index][field] = value;
      setPricingRows(updatedRows);
    };
  
    const addAffiliateRow = () => setAffiliateRows([...affiliateRows, { vendor: '', url: '' }]);
    const removeAffiliateRow = (index) => setAffiliateRows(affiliateRows.filter((_, i) => i !== index));
    const updateAffiliateRow = (index, field, value) => {
      const updatedRows = [...affiliateRows];
      updatedRows[index][field] = value;
      setAffiliateRows(updatedRows);
    };
  
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
      <input type="number" placeholder="Actuation Force (gf)" value={actuationForce} onChange={ev => setActuationForce(ev.target.value)} />
      <input type="number" placeholder="Bottom-Out Force (gf)" value={bottomOutForce} onChange={ev => setBottomOutForce(ev.target.value)} />
      <input type="number" placeholder="Pre-Travel (mm)" value={preTravel} onChange={ev => setPreTravel(ev.target.value)} />
      <input type="number" placeholder="Total Travel (mm)" value={totalTravel} onChange={ev => setTotalTravel(ev.target.value)} />
      <input type="file" onChange={ev => setThumbnail(ev.target.files[0])} />
      <input type="file" onChange={ev => setThreeDModel(ev.target.files[0])} placeholder="Upload 3D Model" />
      <input type="file" onChange={ev => setForceGraph(ev.target.files[0])} placeholder="Upload Force Graph JSON" />
      <input type="file" multiple onChange={ev => setAdditionalImages([...ev.target.files])} />

      <h3>Pricing</h3>
      {pricingRows.map((row, index) => (
        <div key={index}>
          <input type="text" placeholder="Vendor" value={row.vendor} onChange={e => updatePricingRow(index, 'vendor', e.target.value)} />
          <input type="number" placeholder="Price" value={row.price} onChange={e => updatePricingRow(index, 'price', e.target.value)} />
          <input type="number" placeholder="Stock" value={row.stock} onChange={e => updatePricingRow(index, 'stock', e.target.value)} />
          <input type="text" placeholder="Coupon Code" value={row.coupon} onChange={e => updatePricingRow(index, 'coupon', e.target.value)} />
          <button type="button" onClick={() => removePricingRow(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={addPricingRow}>Add Pricing</button>

      <h3>Affiliate Links</h3>
      {affiliateRows.map((row, index) => (
        <div key={index}>
          <input type="text" placeholder="Vendor" value={row.vendor} onChange={e => updateAffiliateRow(index, 'vendor', e.target.value)} />
          <input type="text" placeholder="Affiliate URL" value={row.url} onChange={e => updateAffiliateRow(index, 'url', e.target.value)} />
          <button type="button" onClick={() => removeAffiliateRow(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={addAffiliateRow}>Add Affiliate Link</button>

      <button style={{ marginTop: '10px' }}>Create Switch</button>
    </form>
  );
}
