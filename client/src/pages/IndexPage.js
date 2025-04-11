import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css'; 

function SwitchCard({ switchItem }) {
    const cardClassName = `switch-card-simple`;
    const imgClassName = `switch-card-simple-img`;

    return (
      <div className={cardClassName}>
        <Link to={`/switches/${switchItem._id}`}>
          <img
            src={`http://localhost:4000${switchItem.thumbnail}`}
            alt={switchItem.name || 'Switch Image'}
            className={imgClassName}
            onError={(e) => {
              console.warn(`Error loading image: ${`http://localhost:4000${switchItem.thumbnail}`}`);
              e.target.onerror = null;
              e.target.src = '/placeholder-image.png';
            }}
          />
          <h4 className="switch-card-simple-name">{switchItem.name}</h4>
        </Link>
      </div>
    );
  }


export default function IndexPage() {
  const [allRecentSwitches, setAllRecentSwitches] = useState([]); 
  const [displayedSwitches, setDisplayedSwitches] = useState([]); 

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9; 
  const totalRecentToFetch = 45;

  const [allSwitches, setAllSwitches] = useState([]);
  const [filteredAllSwitches, setFilteredAllSwitches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [uniqueBrands, setUniqueBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:4000/api/switches')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setAllSwitches(data);
        setFilteredAllSwitches(data);
        const brands = [...new Set(data.map(sw => sw.manufacturer).filter(Boolean))];
        setUniqueBrands(['All', ...brands]);
        const sortedData = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const recentSwitchesBatch = sortedData.slice(0, totalRecentToFetch);

        setAllRecentSwitches(recentSwitchesBatch); 

        setDisplayedSwitches(recentSwitchesBatch.slice(0, itemsPerPage));
        setCurrentPage(0);
      })
      .catch(error => console.error("Error fetching switches:", error));
  }, [totalRecentToFetch, itemsPerPage]); 


   const handleNextPage = () => {
    const nextPage = currentPage + 1;
    const startIndex = nextPage * itemsPerPage;
    if (startIndex < allRecentSwitches.length) { 
      const nextSlice = allRecentSwitches.slice(startIndex, startIndex + itemsPerPage);
      setDisplayedSwitches(nextSlice);
      setCurrentPage(nextPage);
    }
  };

  const handlePrevPage = () => {
    const prevPage = currentPage - 1;
    if (prevPage >= 0) {
      const startIndex = prevPage * itemsPerPage;
      const prevSlice = allRecentSwitches.slice(startIndex, startIndex + itemsPerPage);
      setDisplayedSwitches(prevSlice);
      setCurrentPage(prevPage);
    }
  };

  const totalPages = Math.ceil(allRecentSwitches.length / itemsPerPage);
  const isPrevDisabled = currentPage === 0;
  const isNextDisabled = currentPage >= totalPages - 1; 

   const handleSearchChange = (event) => {
       setSearchTerm(event.target.value);
   };
   const handleSearchSubmit = (event) => {
       event.preventDefault();
       if (searchTerm.trim()) {
       navigate(`/switches?search=${encodeURIComponent(searchTerm.trim())}`);
       } else {
       navigate('/switches');
       }
   };
   const handleBrandFilter = (brand) => {
       setSelectedBrand(brand);
   };


  useEffect(() => {
    if (allSwitches.length > 0) {
        let tempFiltered = [...allSwitches];
        if (selectedBrand !== 'All') {
          tempFiltered = tempFiltered.filter(sw => sw.manufacturer === selectedBrand);
        }
        setFilteredAllSwitches(tempFiltered);
    }
  }, [selectedBrand, allSwitches]); 


  return (
    <div className="homepage-container">
      <div className="header-banner-image">
        <Link to="/switches" className="view-switches-button-banner">View Switches</Link>
      </div>
      <div className="main-content-area">
         <div className="headline-container">
           <h1 className="main-headline">
             explore. design. build.
           </h1>
           <p className="sub-headline">discover the switch for you and your board.</p>
         </div>

         <section className="search-section">
           <form onSubmit={handleSearchSubmit}>
             <input
               type="search"
               placeholder="Search for switches..."
               value={searchTerm}
               onChange={handleSearchChange}
               className="search-input"
             />
             <button type="submit" className="search-button">Search</button>
           </form>
         </section>

        <section className="new-switches-section">
          <h2>New Switches</h2>
          <div className="new-switches-carousel-wrapper"> 
            <button
              className="fixed-layout-nav-arrow fixed-layout-nav-arrow--prev" 
              onClick={handlePrevPage}
              disabled={isPrevDisabled}
              aria-label="Previous Switches"
            >
              &lt;
            </button>

            <div className="fixed-layout-grid">
              {displayedSwitches.length > 0 ? (
                displayedSwitches.map((sw, index) => (
                   <div
                     key={sw._id}
                     className={`grid-item ${index === 0 ? 'grid-item--large' : 'grid-item--small'}`}
                   >
                     <SwitchCard switchItem={sw} />
                   </div>
                ))
              ) : (
                 allRecentSwitches.length > 0 ? <p>No more switches in this view.</p> : <p>Loading new switches...</p>
              )}
            </div>

            <button
              className="fixed-layout-nav-arrow fixed-layout-nav-arrow--next" 
              onClick={handleNextPage}
              disabled={isNextDisabled}
              aria-label="Next Switches"
            >
              &gt;
            </button>
          </div>
        </section>

         <section className="all-switches-preview-section">
           <h2>Switch Gallery</h2>
           <div className="brand-filters">
             {uniqueBrands.map(brand => (
               <button
                 key={brand}
                 onClick={() => handleBrandFilter(brand)}
                 className={selectedBrand === brand ? 'active' : ''}
               >
                 {brand}
               </button>
             ))}
           </div>
           <div className="switch-grid"> 
             {filteredAllSwitches.length > 0 ? (
               filteredAllSwitches.map(sw => <SwitchCard key={sw._id} switchItem={sw} />)
             ) : (
               <p>No switches found matching the criteria.</p>
             )}
           </div>
           <div className="view-all-link">
             <Link to="/switches">View Full Gallery &rarr;</Link>
           </div>
         </section>

      </div> 
    </div> 
  );
}