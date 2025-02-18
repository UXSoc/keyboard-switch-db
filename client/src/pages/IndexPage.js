// src/pages/IndexPage.js
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// List of all filterable properties (excluding profile)
const availableFilters = [
  "name",
  "type",
  "mount",
  "pins",
  "manufacturer",
  "lifetime",
  "actuation_force",
  "bottom_out_force",
  "pre_travel",
  "total_travel",
  "top_housing",
  "bottom_housing",
  "stem_type",
  "stem_material",
  "spring_material",
  "lubricated"
];

// A mapping from field key to a display label
const displayLabels = {
  name: "Name",
  type: "Type",
  mount: "Mount",
  pins: "Pins",
  manufacturer: "Manufacturer",
  lifetime: "Lifetime",
  actuation_force: "Actuation Force",
  bottom_out_force: "Bottom Out Force",
  pre_travel: "Pre-Travel",
  total_travel: "Total Travel",
  top_housing: "Top Housing",
  bottom_housing: "Bottom Housing",
  stem_type: "Stem Type",
  stem_material: "Stem Material",
  spring_material: "Spring Material",
  lubricated: "Lubricated"
};

export default function IndexPage() {
  const [switches, setSwitches] = useState([]);
  const [filteredSwitches, setFilteredSwitches] = useState([]);
  // Holds which properties the user wants to filter on (via checklist)
  const [selectedFilters, setSelectedFilters] = useState([]);
  // Holds the actual filter values for each field
  const [filters, setFilters] = useState({});
  const [uniqueValues, setUniqueValues] = useState({});
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc"); // "asc" or "desc"

  // Fetch the switches data and compute unique values for each field
  useEffect(() => {
    fetch('http://localhost:4000/api/switches')
      .then(response => response.json())
      .then(data => {
        setSwitches(data);
        setFilteredSwitches(data);
        // Compute unique values for each available filter (as strings in lowercase)
        let uniques = {};
        availableFilters.forEach(field => {
          uniques[field] = [
            ...new Set(
              data.map(sw => (sw[field] !== undefined && sw[field] !== null ? sw[field].toString().toLowerCase() : ""))
              .filter(Boolean)
            )
          ];
        });
        setUniqueValues(uniques);
      });
  }, []);

  console.log(uniqueValues);
  // Handler for the checklist that determines which properties to filter for
  function handleFilterSelection(e) {
    const { value, checked } = e.target;
    setSelectedFilters(prev => {
      if (checked) {
        // Initialize the filter value for the field if not already set
        setFilters(prevFilters => ({ ...prevFilters, [value]: "" }));
        return [...prev, value];
      } else {
        return prev.filter(f => f !== value);
      }
    });
  }

  // Generic handler for filter value changes (text inputs)
  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }

  // Handler for checkbox filter changes (for fields with <5 unique values)
  function handleCheckboxFilterChange(e, field) {
    const { value, checked } = e.target;
    setFilters(prev => {
      const prevArr = prev[field + "_checkbox"] || [];
      let newArr = checked ? [...prevArr, value.toLowerCase()] : prevArr.filter(v => v !== value.toLowerCase());
      return { ...prev, [field + "_checkbox"]: newArr, [field]: "" };
    });
  }

  // Handler for boolean filter (lubricated)
  function handleBooleanFilterChange(e) {
    setFilters(prev => ({ ...prev, lubricated: e.target.value }));
  }

  // Handler for sort field and direction changes
  function handleSortFieldChange(e) {
    setSortField(e.target.value);
  }
  function handleSortDirectionChange(e) {
    setSortDirection(e.target.value);
  }

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    let temp = [...switches];

    // Apply each selected filter
    selectedFilters.forEach(field => {
      // Special handling for boolean "lubricated"
      if (field === "lubricated") {
        if (filters.lubricated && filters.lubricated !== "all") {
          const boolVal = filters.lubricated === "true";
          temp = temp.filter(sw => sw.lubricated === boolVal);
        }
      } else {
        // For fields with fewer than 10 unique values, if a checkbox filter is applied
        if (uniqueValues[field] && 1 < uniqueValues[field].length < 10 && filters[field + "_checkbox"] && filters[field + "_checkbox"].length > 0) {
          temp = temp.filter(sw => sw[field] && filters[field + "_checkbox"].includes(sw[field].toString().toLowerCase()));
        } 
        // Otherwise, if a text input filter is set
        else if (filters[field]) {
          temp = temp.filter(sw => sw[field] && sw[field].toString().toLowerCase().includes(filters[field].toLowerCase()));
        }
      }
    });

    // Sorting
    if (sortField) {
      temp.sort((a, b) => {
        let aVal = a[sortField] || "";
        let bVal = b[sortField] || "";
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredSwitches(temp);
  }, [switches, filters, sortField, sortDirection, selectedFilters, uniqueValues]);

  return (
    <div>
      <h1>Switch Gallery</h1>
      
      {/* Preliminary Checklist for Selecting Filterable Properties */}
      <div className="filter-checklist" style={{ width: "90%", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h2>Select Properties to Filter</h2>
        {availableFilters.filter(f => f !== "profile").map((field, idx) => (
          <label key={idx} style={{ marginRight: "10px" }}>
            <input
              type="checkbox"
              value={field}
              checked={selectedFilters.includes(field)}
              onChange={handleFilterSelection}
            />
            {displayLabels[field]}
          </label>
        ))}
      </div>

      {/* Filter Inputs for the Selected Properties */}
      <div className="filter-section" style={{ width: "90%", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", marginTop: "20px" }}>
        <h2>Filter Options</h2>
        {selectedFilters.map((field, idx) => (
          <div key={idx} className="filter-group" style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>{displayLabels[field]}:</label>
            {field === "lubricated" ? (
              <select name="lubricated" value={filters.lubricated || "all"} onChange={handleBooleanFilterChange}>
                <option value="all">All</option>
                <option value="true">Lubricated</option>
                <option value="false">Non-Lubricated</option>
              </select>
            ) : (
              <>
                {uniqueValues[field] && uniqueValues[field].length < 5 ? (
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {uniqueValues[field].map((val, i) => (
                      <label key={i} style={{ marginRight: "10px" }}>
                        <input
                          type="checkbox"
                          value={val}
                          onChange={(e) => handleCheckboxFilterChange(e, field)}
                          checked={filters[field + "_checkbox"] ? filters[field + "_checkbox"].includes(val) : false}
                        />
                        {val}
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    name={field}
                    value={filters[field] || ""}
                    onChange={handleFilterChange}
                    placeholder={`Filter by ${displayLabels[field]}`}
                  />
                )}
              </>
            )}
          </div>
        ))}

        {/* Sort Options */}
        <div className="filter-group">
          <h3>Sort Options</h3>
          <label>
            Sort By:
            <select value={sortField} onChange={handleSortFieldChange}>
              <option value="">None</option>
              {availableFilters.map((field, i) => (
                <option key={i} value={field}>
                  {displayLabels[field]}
                </option>
              ))}
            </select>
          </label>
          <div>
            <label>
              <input
                type="radio"
                name="sortDirection"
                value="asc"
                checked={sortDirection === "asc"}
                onChange={handleSortDirectionChange}
              />
              Ascending
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input
                type="radio"
                name="sortDirection"
                value="desc"
                checked={sortDirection === "desc"}
                onChange={handleSortDirectionChange}
              />
              Descending
            </label>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div
        className="gallery"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "90%",
          margin: "auto",
          marginTop: "20px"
        }}
      >
        {filteredSwitches.map(sw => (
          <div
            key={sw._id}
            className="switch-card"
            style={{
              width: "23%",
              margin: "10px 0",
              textAlign: "center",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              boxSizing: "border-box"
            }}
          >
            <img
              src={`http://localhost:4000${sw.thumbnail}`}
              alt={sw.name}
              style={{
                width: "100%",
                maxHeight: "150px",
                objectFit: "contain",
                borderRadius: "8px",
                marginBottom: "10px"
              }}
            />
            <h2>{sw.name}</h2>
            {/* Only display fields that were selected (except name, which is always shown) */}
            {(selectedFilters.includes("type") || sortField === "type") && <p>{displayLabels["type"]}: {sw.type}</p>}
            {(selectedFilters.includes("mount") || sortField === "mount") && <p>{displayLabels["mount"]}: {sw.mount}</p>}
            {(selectedFilters.includes("manufacturer") || sortField === "manufacturer") && <p>{displayLabels["manufacturer"]}: {sw.manufacturer}</p>}
            {(selectedFilters.includes("lifetime") || sortField === "lifetime") && <p>{displayLabels["lifetime"]}: {sw.lifetime}</p>}
            {(selectedFilters.includes("actuation_force") || sortField === "actuation_force") && <p>{displayLabels["actuation_force"]}: {sw.actuation_force}</p>}
            {(selectedFilters.includes("bottom_out_force") || sortField === "bottom_out_force") && <p>{displayLabels["bottom_out_force"]}: {sw.bottom_out_force}</p>}
            {(selectedFilters.includes("pre_travel") || sortField === "pre_travel") && <p>{displayLabels["pre_travel"]}: {sw.pre_travel}</p>}
            {(selectedFilters.includes("total_travel") || sortField === "total_travel") && <p>{displayLabels["total_travel"]}: {sw.total_travel}</p>}
            {(selectedFilters.includes("pins") || sortField === "pins") && <p>{displayLabels["pins"]}: {sw.pins}</p>}
            {(selectedFilters.includes("top_housing") || sortField === "top_housing") && <p>{displayLabels["top_housing"]}: {sw.top_housing}</p>}
            {(selectedFilters.includes("bottom_housing") || sortField === "bottom_housing") && <p>{displayLabels["bottom_housing"]}: {sw.bottom_housing}</p>}
            {(selectedFilters.includes("stem_type") || sortField === "stem_type") && <p>{displayLabels["stem_type"]}: {sw.stem_type}</p>}
            {(selectedFilters.includes("stem_material") || sortField === "stem_material") && <p>{displayLabels["stem_material"]}: {sw.stem_material}</p>}
            {(selectedFilters.includes("spring_material") || sortField === "spring_material") && <p>{displayLabels["spring_material"]}: {sw.spring_material}</p>}
            {(selectedFilters.includes("lubricated") || sortField === "lubricated") && (
              <p>{displayLabels["lubricated"]}: {sw.lubricated ? "Yes" : "No"}</p>
            )}
            <Link to={`/switches/${sw._id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
