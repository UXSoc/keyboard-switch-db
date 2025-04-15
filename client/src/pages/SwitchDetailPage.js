import React, { useState, useEffect } from "react"; 
import { useParams, Link } from "react-router-dom";
import './SwitchDetailPage.css'; 


const formatSpec = (value, unit = '') => {
    if (value === null || value === undefined || value === '') return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return `${value}${unit}`;
};

export default function SwitchDetailPage() {
  const { id } = useParams();
  const [switchData, setSwitchData] = useState(null);
  const [images, setImages] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [affiliateLinks, setAffiliateLinks] = useState([]);
  const [forceGraphs, setForceGraphs] = useState([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState(''); // State for main image

  useEffect(() => {
    // Fetch all data in parallel
    const fetchData = async () => {
        try {
            const [switchRes, imagesRes, pricingRes, affiliateRes, forceGraphRes] = await Promise.all([
                fetch(`http://localhost:4000/api/switches/${id}`),
                fetch(`http://localhost:4000/api/switch-images/${id}`),
                fetch(`http://localhost:4000/api/pricing/${id}`),
                fetch(`http://localhost:4000/api/affiliate-links/${id}`),
                fetch(`http://localhost:4000/api/forceGraphs/${id}`) 
            ]);

            // Check responses before parsing JSON
            const switchJson = switchRes.ok ? await switchRes.json() : null;
            const imagesJson = imagesRes.ok ? await imagesRes.json() : [];
            const pricingJson = pricingRes.ok ? await pricingRes.json() : [];
            const affiliateJson = affiliateRes.ok ? await affiliateRes.json() : [];
            const forceGraphJson = forceGraphRes.ok ? await forceGraphRes.json() : []; 

            setSwitchData(switchJson);
            setImages(Array.isArray(imagesJson) ? imagesJson : []); 
            setPricing(Array.isArray(pricingJson) ? pricingJson : []);
            setAffiliateLinks(Array.isArray(affiliateJson) ? affiliateJson : []);
            setForceGraphs(Array.isArray(forceGraphJson) ? forceGraphJson : []);

            // Set initial selected image (use thumbnail first, then first gallery image)
            if (switchJson?.thumbnail) {
                 setSelectedImageUrl(`http://localhost:4000${switchJson.thumbnail}`);
            } else if (imagesJson.length > 0 && imagesJson[0].image_url) {
                const firstImageUrl = imagesJson[0].image_url;
                 setSelectedImageUrl(firstImageUrl.includes("://") ? firstImageUrl : `http://localhost:4000${firstImageUrl}`);
            } else {
                 setSelectedImageUrl('/placeholder-image.png'); // Fallback
            }

        } catch (error) {
            console.error("Error fetching switch details:", error);
             setSwitchData(null); // Indicate loading failed
        }
    };

    fetchData();
  }, [id]);

  const handleThumbnailClick = (imageUrl) => {
      // Construct full URL if it's a relative path from the backend
      const fullUrl = imageUrl.includes("://") ? imageUrl : `http://localhost:4000${imageUrl}`;
      setSelectedImageUrl(fullUrl);
  };

  if (!switchData) {
       return <div>Loading switch details...</div>;
  }


  return (
    <div className="switch-detail-page">
      <h1>{switchData.name || 'Switch Details'}</h1>

      <div className="detail-content-wrapper">
        {/* --- Left Column --- */}
        <div className="detail-left-column">
          {/* Image Gallery */}
          <section className="image-gallery detail-section">
             {/* Only render gallery if there are images or a thumbnail */}
             {(images.length > 0 || switchData.thumbnail) ? (
                 <>
                    <div className="thumbnail-list">
                        {/* Add thumbnail to the list if it exists */}
                        {switchData.thumbnail && (
                             <img
                                key="thumb"
                                src={`http://localhost:4000${switchData.thumbnail}`}
                                alt={`${switchData.name} thumbnail`}
                                className={`thumbnail-item ${selectedImageUrl.includes(switchData.thumbnail) ? 'active' : ''}`}
                                onClick={() => handleThumbnailClick(switchData.thumbnail)}
                                onError={(e) => { e.target.onerror = null; e.target.src='/placeholder-image.png'; }}
                             />
                        )}
                        {/* Map through additional images */}
                         {images.map((image, index) => (
                             <img
                                key={image._id || index}
                                src={image.image_url.includes("://") ? image.image_url : `http://localhost:4000${image.image_url}`}
                                alt={`${switchData.name} image ${index + 1}`}
                                className={`thumbnail-item ${selectedImageUrl.includes(image.image_url) ? 'active' : ''}`}
                                onClick={() => handleThumbnailClick(image.image_url)}
                                onError={(e) => { e.target.onerror = null; e.target.src='/placeholder-image.png'; }}
                             />
                         ))}
                    </div>
                    <div className="main-image-container">
                         <img
                             src={selectedImageUrl}
                             alt={`Selected view of ${switchData.name}`}
                             className="main-image"
                             onError={(e) => { e.target.onerror = null; e.target.src='/placeholder-image.png'; }}
                         />
                    </div>
                 </>
             ) : (
                 <div className="main-image-container">
                     <img src='/placeholder-image.png' alt="No image available" className="main-image" />
                 </div>
             )}
          </section>

           <section className="tags-section detail-section placeholder-section">
                <h3>Tags</h3>
                <p>Tag display area (data not available)</p>
           </section>

          {/* Specs Section */}
          <section className="specs-section detail-section">
            <h3>Specifications</h3>
            <ul>
               <li><strong>Type:</strong> {formatSpec(switchData.type)}</li>
               <li><strong>Manufacturer:</strong> {formatSpec(switchData.manufacturer)}</li>
               <li><strong>Profile:</strong> {formatSpec(switchData.profile)}</li>
               <li><strong>Mount:</strong> {formatSpec(switchData.mount)}</li>
               <li><strong>Pins:</strong> {formatSpec(switchData.pins)}</li>
               <li><strong>Lubricated:</strong> {formatSpec(switchData.lubricated)}</li>
               <li><strong>Lifetime:</strong> {formatSpec(switchData.lifetime, ' cycles')}</li>
               <li><strong>Actuation Force:</strong> {formatSpec(switchData.actuation_force, ' gf')}</li>
               <li><strong>Bottom Out Force:</strong> {formatSpec(switchData.bottom_out_force, ' gf')}</li>
               <li><strong>Pre-Travel:</strong> {formatSpec(switchData.pre_travel, ' mm')}</li>
               <li><strong>Total Travel:</strong> {formatSpec(switchData.total_travel, ' mm')}</li>
               <li><strong>Top Housing:</strong> {formatSpec(switchData.top_housing)}</li>
               <li><strong>Bottom Housing:</strong> {formatSpec(switchData.bottom_housing)}</li>
               <li><strong>Stem Type:</strong> {formatSpec(switchData.stem_type)}</li>
               <li><strong>Stem Material:</strong> {formatSpec(switchData.stem_material)}</li>
               <li><strong>Spring Material:</strong> {formatSpec(switchData.spring_material)}</li>
            </ul>
             {switchData.description && (
                <>
                 <h4>Description</h4>
                 <p>{switchData.description}</p>
                 </>
             )}
          </section>

           {/* Force Graph Section */}
           {forceGraphs && forceGraphs.length > 0 && (
             <section className="force-graph-section detail-section">
               <h3>Force Graph Data</h3>
               {forceGraphs.map((graph, index) => (
                 <div key={graph._id || index}>
                   <p>Source: {graph.source || `Graph ${index + 1}`}</p>
                   <pre>{JSON.stringify(graph.graph_data || graph, null, 2)}</pre>
                 </div>
               ))}
             </section>
           )}

          {/* Reviews Section (Placeholder) */}
           <section className="reviews-section detail-section placeholder-section">
                <h3>Reviews</h3>
                <p>Reviews display area (data not available)</p>
           </section>

        </div> 

        <div className="detail-right-column">
          {pricing && pricing.length > 0 && (
              <section className="pricing-section detail-section">
                <h3>Where to Buy</h3>
                <table className="pricing-table">
                    <thead>
                        <tr>
                            <th>Vendor</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th></th> 
                        </tr>
                    </thead>
                    <tbody>
                        {pricing.map((priceInfo, index) => (
                            <tr key={priceInfo._id || index}>
                                <td>{priceInfo.vendor_id?.name || priceInfo.vendor || 'Unknown Vendor'}</td>
                                <td>{priceInfo.price ? `$${priceInfo.price.toFixed(2)}` : 'N/A'}</td>
                                <td>{priceInfo.in_stock ? 'In Stock' : 'Out of Stock'}</td>
                                <td>
                                     <span className="cart-icon" title="Add to cart (placeholder)"></span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </section>
          )}

           {/* Affiliate Links Section */}
           {affiliateLinks && affiliateLinks.length > 0 && (
              <section className="affiliate-links-section detail-section">
                  <h3>Affiliate Links</h3>
                  <ul className="affiliate-links-list">
                      {affiliateLinks.map((link, index) => {
                          let vendorName = 'Unknown Vendor';
                          try {
                              // Extract hostname as vendor name
                              vendorName = new URL(link.affiliate_url).hostname.replace(/^www\./, '');
                          } catch (e) {
                              console.error("Invalid affiliate URL:", link.affiliate_url);
                          }
                          return (
                              <li key={link._id || index} className="affiliate-link">
                                  <strong>{vendorName}:</strong>{' '}
                                  <a href={link.affiliate_url} target="_blank" rel="noopener noreferrer sponsored">
                                      Link
                                  </a>
                              </li>
                          );
                      })}
                  </ul>
              </section>
           )}

           {/* Ratings Section (Placeholder) */}
           <section className="ratings-section detail-section placeholder-section">
                <h3>Ratings</h3>
                <p>Ratings display area (data not available)</p>
           </section>

           {/* Similar Purchases Section (Placeholder) */}
           <section className="similar-purchases detail-section placeholder-section">
                <h3>Similar Switches</h3>
                <p>Similar switches display area (data not available)</p>
           </section>


           <Link to={`/switches/edit/${id}`} className="edit-switch-button">
                Edit Switch
           </Link>

        </div> 

      </div>
    </div> 
  );
}