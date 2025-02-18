import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function SwitchDetailPage() {
  const { id } = useParams();
  const [switchData, setSwitchData] = useState(null);
  const [images, setImages] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [affiliateLinks, setAffiliateLinks] = useState([]);
  const [forceGraphs, setForceGraphs] = useState([]);
  
  useEffect(() => {
    // Fetching switch details
    fetch(`http://localhost:4000/api/switches/${id}`)
      .then(res => res.json())
      .then(data => setSwitchData(data));
      
    // Fetching images
    fetch(`http://localhost:4000/api/switch-images/${id}`)
      .then(res => res.json())
      .then(data => setImages(data));
      
    // Fetching pricing information
    fetch(`http://localhost:4000/api/pricing/${id}`)
      .then(res => res.json())
      .then(data => setPricing(data));
      
    // Fetching affiliate links
    fetch(`http://localhost:4000/api/affiliate-links/${id}`)
      .then(res => res.json())
      .then(data => setAffiliateLinks(data));
      
    // Fetching force graphs
    fetch(`http://localhost:4000/api/forceGraphs/${id}`)
      .then(res => res.json())
      .then(data => setForceGraphs(data));
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
      <p>Bottom Out Force: {switchData.bottom_out_force} gf</p>
      <p>Pre-Travel: {switchData.pre_travel} mm</p>
      <p>Total Travel: {switchData.total_travel} mm</p>

      <h3>Images</h3>
      <div>
        {images.map((image, index) => (
          <img key={index} src={((image.image_url.includes("https://")) ? image.image_url : `http://localhost:4000${image.image_url}`)} alt={`Switch Image ${index}`} style={{width: '100px', margin: '5px'}} />
        ))}
      </div>

      <h3>Pricing</h3>
      <div>
        {pricing.map((price, index) => (
          <div key={index}>
            <p>Vendor: {price.vendor}</p>
            <p>Price: ${price.price}</p>
            <p>Stock: {price.stock}</p>
            <p>Coupon: {price.coupon}</p>
          </div>
        ))}
      </div>

      <h3>Affiliate Links</h3>
      <div>
        {affiliateLinks.map((link, index) => (
          <div key={index}>
            <p>Vendor: {link.vendor}</p>
            <p><a href={link.url} target="_blank" rel="noopener noreferrer">Affiliate Link</a></p>
          </div>
        ))}
      </div>

      <h3>Force Graph</h3>
      <div>
        {forceGraphs.map((graph, index) => (
          <div key={index}>
            <p>Force Graph Data {index + 1}:</p>
            <pre>{JSON.stringify(graph, null, 2)}</pre> {/* Assuming force graph is in JSON format */}
          </div>
        ))}
      </div>

      <Link to={`/switches/edit/${id}`}>
        <button>Edit Switch</button>
      </Link>
    </div>
  );
}
