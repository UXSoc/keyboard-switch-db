import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

function SwitchCard({ switchItem }) {
    const cardClassName = `switch-card-simple`;
    const imgClassName = `switch-card-simple-img`;
    const thumbnailUrl = switchItem?.thumbnail
      ? `${switchItem.thumbnail}`
      : '/placeholder-image.png';

    return (
      <div className={cardClassName}>
        <Link to={`/switches/${switchItem._id}`}>
          <img
            src={thumbnailUrl}
            alt={switchItem?.name || 'Switch Image'}
            className={imgClassName}
            onError={(e) => {
              console.warn(`Error loading image: ${thumbnailUrl}`);
              e.target.onerror = null;
              e.target.src = '/placeholder-image.png';
            }}
          />
          <h4 className="switch-card-simple-name">{switchItem?.name || 'Unknown Switch'}</h4>
        </Link>
      </div>
    );
}

const ELLIPSIS = '...';

function generatePaginationNumbers(currentPage, totalPages, isMobileView) {
    const pageNumbers = new Set(); 
    const currentPageActual = currentPage + 1; 

    if (totalPages <= 1) return []; 

    const maxVisibleDesktop = 9; 
    const maxVisibleMobile = 5;

    if (isMobileView && totalPages > maxVisibleMobile) {
        pageNumbers.add(1); 

        if (currentPageActual > 2) { 
            pageNumbers.add(ELLIPSIS);
        }

        if (currentPageActual > 1 && currentPageActual < totalPages) {
             pageNumbers.add(currentPageActual);
        }

        if (currentPageActual < totalPages - 1) { 
            pageNumbers.add(ELLIPSIS);
        }

        pageNumbers.add(totalPages);
    }

    else if (!isMobileView && totalPages > maxVisibleDesktop) {
        pageNumbers.add(1); 

        const rangeSize = 5; 
        const halfRange = Math.floor(rangeSize / 2); // = 2

        let rangeStart = currentPageActual - halfRange;
        let rangeEnd = currentPageActual + halfRange;

        const showEllipsisStart = rangeStart > 2;
        const showEllipsisEnd = rangeEnd < totalPages - 1;

        if (rangeStart <= 2) {
            rangeStart = 2;
            rangeEnd = Math.min(totalPages - 1, rangeStart + rangeSize - 1);
        }

        if (rangeEnd >= totalPages - 1) {
            rangeEnd = totalPages - 1;
            rangeStart = Math.max(2, rangeEnd - rangeSize + 1);
        }

        if (showEllipsisStart) {
             pageNumbers.add(ELLIPSIS);
        }

        for (let i = rangeStart; i <= rangeEnd; i++) {
            pageNumbers.add(i);
        }

         if (showEllipsisEnd) {
             pageNumbers.add(ELLIPSIS);
         }

        pageNumbers.add(totalPages); 

    }
    else {
         for (let i = 1; i <= totalPages; i++) {
            pageNumbers.add(i);
        }
    }

    return Array.from(pageNumbers); 
}

export default function IndexPage() {
    const [allRecentSwitches, setAllRecentSwitches] = useState([]);
    const [displayedNewSwitches, setDisplayedNewSwitches] = useState([]);
    const [newSwitchesCurrentPage, setNewSwitchesCurrentPage] = useState(0);
    const newSwitchesItemsPerPage = 9;
    const totalRecentToFetch = 45;

    const [allSwitches, setAllSwitches] = useState([]);
    const [filteredSwitches, setFilteredSwitches] = useState([]);
    const [displayedFilteredSwitches, setDisplayedFilteredSwitches] = useState([]);
    const [allSwitchesCurrentPage, setAllSwitchesCurrentPage] = useState(0);
    const allSwitchesItemsPerPage = 12;

    const [searchTerm, setSearchTerm] = useState('');
    const [uniqueBrands, setUniqueBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('All');
    const navigate = useNavigate();

    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 640);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 640); 
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    useEffect(() => {
        fetch('/api/switches')
          .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
          })
          .then(data => {
            setAllSwitches(data);
            setFilteredSwitches(data);
            const brands = [...new Set(data.map(sw => sw?.manufacturer).filter(Boolean))];
            setUniqueBrands(['All', ...brands]);
            const sortedData = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const recentSwitchesBatch = sortedData.slice(0, totalRecentToFetch);
            setAllRecentSwitches(recentSwitchesBatch);
            setDisplayedNewSwitches(recentSwitchesBatch.slice(0, newSwitchesItemsPerPage));
            setNewSwitchesCurrentPage(0);
            setDisplayedFilteredSwitches(data.slice(0, allSwitchesItemsPerPage));
            setAllSwitchesCurrentPage(0);
          })
          .catch(error => console.error("Error fetching switches:", error));
      }, [totalRecentToFetch, newSwitchesItemsPerPage, allSwitchesItemsPerPage]);

      useEffect(() => {
        if (allSwitches.length > 0) {
            let tempFiltered = [...allSwitches];
            if (selectedBrand !== 'All') {
              tempFiltered = tempFiltered.filter(sw => sw?.manufacturer === selectedBrand);
            }
            setFilteredSwitches(tempFiltered);
            setAllSwitchesCurrentPage(0);
        }
      }, [selectedBrand, allSwitches]);

      useEffect(() => {
         const startIndex = allSwitchesCurrentPage * allSwitchesItemsPerPage;
         setDisplayedFilteredSwitches(filteredSwitches.slice(startIndex, startIndex + allSwitchesItemsPerPage));
       }, [allSwitchesCurrentPage, filteredSwitches, allSwitchesItemsPerPage]);

    const handleNewSwitchesNextPage = () => {
      const nextPage = newSwitchesCurrentPage + 1;
      const startIndex = nextPage * newSwitchesItemsPerPage;
      if (startIndex < allRecentSwitches.length) {
        const nextSlice = allRecentSwitches.slice(startIndex, startIndex + newSwitchesItemsPerPage);
        setDisplayedNewSwitches(nextSlice);
        setNewSwitchesCurrentPage(nextPage);
      }
    };
    const handleNewSwitchesPrevPage = () => {
      const prevPage = newSwitchesCurrentPage - 1;
      if (prevPage >= 0) {
        const startIndex = prevPage * newSwitchesItemsPerPage;
        const prevSlice = allRecentSwitches.slice(startIndex, startIndex + newSwitchesItemsPerPage);
        setDisplayedNewSwitches(prevSlice);
        setNewSwitchesCurrentPage(prevPage);
      }
    };
    const newSwitchesTotalPages = allRecentSwitches.length > 0 ? Math.ceil(allRecentSwitches.length / newSwitchesItemsPerPage) : 0;
    const isNewSwitchesPrevDisabled = newSwitchesCurrentPage === 0;
    const isNewSwitchesNextDisabled = newSwitchesCurrentPage >= newSwitchesTotalPages - 1;

    const handleAllSwitchesNextPage = () => {
        const nextPage = allSwitchesCurrentPage + 1;
        if (nextPage * allSwitchesItemsPerPage < filteredSwitches.length) { 
            setAllSwitchesCurrentPage(nextPage);
        }
    };
    const handleAllSwitchesPrevPage = () => {
        const prevPage = allSwitchesCurrentPage - 1;
        if (prevPage >= 0) {
            setAllSwitchesCurrentPage(prevPage);
        }
    };
    const handlePageNumberClick = (pageNumber) => { setAllSwitchesCurrentPage(pageNumber - 1); };
    const allSwitchesTotalPages = filteredSwitches.length > 0 ? Math.ceil(filteredSwitches.length / allSwitchesItemsPerPage) : 0;
    const isAllSwitchesPrevDisabled = allSwitchesCurrentPage === 0;
    const isAllSwitchesNextDisabled = allSwitchesCurrentPage >= allSwitchesTotalPages - 1;

    const handleSearchChange = (event) => { setSearchTerm(event.target.value); };
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchTerm.trim()) {
          navigate(`/switches?search=${encodeURIComponent(searchTerm.trim())}`);
        } else {
          navigate('/switches');
        }
    };
    const handleBrandFilterClick = (brand) => { setSelectedBrand(brand); };

    const paginationNumbers = useMemo(() => {
        return generatePaginationNumbers(allSwitchesCurrentPage, allSwitchesTotalPages, isMobileView);
    }, [allSwitchesCurrentPage, allSwitchesTotalPages, isMobileView]);

    return (
        <div className="homepage-container">
            
            <div className="header-banner-image">
                <Link to="/switches" className="view-switches-button-banner">View Switches</Link>
            </div>

            
            <div className="main-content-area">
                
                 <div className="headline-container">
                     <h1 className="main-headline">explore. design. build.</h1>
                     <p className="sub-headline">discover the switch for you and your board.</p>
                 </div>
                 <section className="search-section">
                     <form onSubmit={handleSearchSubmit}>
                         <input type="search" placeholder="Search for switches..." value={searchTerm} onChange={handleSearchChange} className="search-input"/>
                         <button type="submit" className="search-button">Search</button>
                     </form>
                 </section>

                
                 <section className="new-switches-section">
                     <h2>New Switches</h2>
                     <div className="new-switches-carousel-wrapper">
                         <button className="fixed-layout-nav-arrow fixed-layout-nav-arrow--prev" onClick={handleNewSwitchesPrevPage} disabled={isNewSwitchesPrevDisabled} aria-label="Previous New Switches"> &lt; </button>
                         <div className="fixed-layout-grid">
                             {displayedNewSwitches.length > 0 ? (
                                 displayedNewSwitches.map((sw, index) => (
                                     <div key={sw?._id || index} className={`grid-item ${index === 0 ? 'grid-item--large' : 'grid-item--small'}`}>
                                         {sw && <SwitchCard switchItem={sw} />}
                                     </div>
                                 ))
                             ) : ( <p className="grid-placeholder">{allRecentSwitches.length > 0 ? "No more switches." : "Loading..."}</p> )}
                         </div>
                         <button className="fixed-layout-nav-arrow fixed-layout-nav-arrow--next" onClick={handleNewSwitchesNextPage} disabled={isNewSwitchesNextDisabled} aria-label="Next New Switches"> &gt; </button>
                     </div>
                 </section>

                
                <section className="all-switches-preview-section">
                    <h2>Switch Gallery</h2>
                    
                    <div className="brand-filters">
                         {uniqueBrands.map(brand => ( <button key={brand} onClick={() => handleBrandFilterClick(brand)} className={selectedBrand === brand ? 'active' : ''} > {brand} </button> ))}
                     </div>

                    
                    <div className="switch-grid">
                        {displayedFilteredSwitches.length > 0 ? (
                            displayedFilteredSwitches.map(sw => sw && <SwitchCard key={sw._id} switchItem={sw} />)
                        ) : ( <p>{allSwitches.length > 0 ? "No switches found for this brand." : "Loading switches..."}</p> )}
                    </div>

                    
                    {allSwitchesTotalPages > 1 && (
                        <div className="pagination-controls">
                            <button className="pagination-arrow" onClick={handleAllSwitchesPrevPage} disabled={isAllSwitchesPrevDisabled} aria-label="Previous Page">
                                &lt; 
                            </button>

                            
                            {paginationNumbers.map((page, index) =>
                                typeof page === 'number' ? (
                                    <button
                                        key={page}
                                        onClick={() => handlePageNumberClick(page)}
                                        className={`page-number ${page === allSwitchesCurrentPage + 1 ? 'active' : ''}`}
                                        aria-current={page === allSwitchesCurrentPage + 1 ? 'page' : undefined}
                                        aria-label={`Go to page ${page}`}
                                    >
                                        {page}
                                    </button>
                                ) : (
                                    <span key={`ellipsis-${index}`} className="ellipsis" aria-hidden="true">{page}</span>
                                )
                            )}

                            <button className="pagination-arrow" onClick={handleAllSwitchesNextPage} disabled={isAllSwitchesNextDisabled} aria-label="Next Page">
                                &gt; 
                            </button>
                        </div>
                    )}

                    
                    <div className="view-all-link">
                        <Link to="/switches">View Full Gallery &rarr;</Link>
                    </div>
                </section>
            </div>
        </div>
    );
}