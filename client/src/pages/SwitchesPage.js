import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// List of all filterable properties (excluding profile)
const availableFilters = [
  "name",
  "type",
  "mount",
  // "pins",
  // "manufacturer",
  // "lifetime",
  "actuation_force",
  "bottom_out_force",
  "pre_travel",
  "total_travel",
  // "top_housing",
  // "bottom_housing",
  // "stem_type",
  // "stem_material",
  // "spring_material",
  "lubricated"
];

// A mapping from field key to a display label
const displayLabels = {
  name: "Name",
  type: "Type",
  mount: "Mount",
  // pins: "Pins",
  // manufacturer: "Manufacturer",
  // lifetime: "Lifetime",
  actuation_force: "Actuation Force",
  bottom_out_force: "Bottom Out Force",
  pre_travel: "Pre-Travel",
  total_travel: "Total Travel",
  // top_housing: "Top Housing",
  // bottom_housing: "Bottom Housing",
  // stem_type: "Stem Type",
  // stem_material: "Stem Material",
  // spring_material: "Spring Material",
  lubricated: "Lubricated"
};

export default function SwitchesPage() {
  const [switches, setSwitches] = useState([]);
  const [filteredSwitches, setFilteredSwitches] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filters, setFilters] = useState({});
  const [uniqueValues, setUniqueValues] = useState({});
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  // Add effect to control body background
  useEffect(() => {
    // Set background color when component mounts
    document.body.style.backgroundColor = '#FFFFFF';
    
    // Reset background color when component unmounts
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  // Fetch the switches data and compute unique values for each field
  useEffect(() => {
    fetch("/api/switches")
      .then((response) => response.json())
      .then((data) => {
        setSwitches(data);
        setFilteredSwitches(data);
        let uniques = {};
        availableFilters.forEach((field) => {
          uniques[field] = [
            ...new Set(
              data
                .map((sw) =>
                  sw[field] !== undefined && sw[field] !== null
                    ? sw[field].toString().toLowerCase()
                    : ""
                )
                .filter(Boolean)
            ),
          ];
        });
        setUniqueValues(uniques);
      });
  }, []);

  function handleFilterSelection(e) {
    const { value, checked } = e.target;
    setSelectedFilters((prev) => {
      if (checked) {
        setFilters((prevFilters) => ({ ...prevFilters, [value]: "" }));
        return [...prev, value];
      } else {
        return prev.filter((f) => f !== value);
      }
    });
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function handleCheckboxFilterChange(e, field) {
    const { value, checked } = e.target;
    setFilters((prev) => {
      const prevArr = prev[field + "_checkbox"] || [];
      let newArr = checked
        ? [...prevArr, value.toLowerCase()]
        : prevArr.filter((v) => v !== value.toLowerCase());
      return { ...prev, [field + "_checkbox"]: newArr, [field]: "" };
    });
  }

  function handleBooleanFilterChange(e) {
    setFilters((prev) => ({ ...prev, lubricated: e.target.value }));
  }

  function handleSortFieldChange(e) {
    setSortField(e.target.value);
  }

  function handleSortDirectionChange(e) {
    setSortDirection(e.target.value);
  }

  useEffect(() => {
    let temp = [...switches];

    selectedFilters.forEach((field) => {
      if (field === "lubricated") {
        if (filters.lubricated && filters.lubricated !== "all") {
          const boolVal = filters.lubricated === "true";
          temp = temp.filter((sw) => sw.lubricated === boolVal);
        }
      } else {
        if (
          uniqueValues[field] &&
          1 < uniqueValues[field].length < 10 &&
          filters[field + "_checkbox"] &&
          filters[field + "_checkbox"].length > 0
        ) {
          temp = temp.filter(
            (sw) =>
              sw[field] &&
              filters[field + "_checkbox"].includes(
                sw[field].toString().toLowerCase()
              )
          );
        } else if (filters[field]) {
          temp = temp.filter(
            (sw) =>
              sw[field] &&
              sw[field].toString().toLowerCase().includes(filters[field].toLowerCase())
          );
        }
      }
    });

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
    <div style={{ 
      padding: window.innerWidth > 768 ? "10px 10% 0" : "10px 15px 0",
      backgroundColor: "#FFFFFF" 
    }}>
      <h1 style={{color: "black"}}>Switch Gallery</h1>
      <div style={{ 
        display: "flex", 
        width: "100%", 
        marginTop: "20px",
        flexDirection: window.innerWidth > 768 ? "row" : "column-reverse",
        gap: "20px"
      }}>
        {/* Left Side: List View of Switches */}
        <div style={{ 
          flex: window.innerWidth > 768 ? "7" : "1",
          paddingRight: window.innerWidth > 768 ? "20px" : "0"
        }}>
          <div className="gallery" style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}>
            {filteredSwitches.map((sw) => (
              <div
                key={sw._id}
                className="switch-card"
                style={{
                  display: "flex",
                  flexDirection: window.innerWidth > 480 ? "row" : "column",
                  alignItems: "center",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                  boxSizing: "border-box",
                  color: "000000"
                }}
              >
                <img
                  src={`${sw.thumbnail}`}
                  alt={sw.name}
                  style={{
                    width: window.innerWidth > 480 ? "100px" : "100%",
                    height: window.innerWidth > 480 ? "100px" : "200px",
                    objectFit: "contain",
                    borderRadius: "8px",
                    marginRight: window.innerWidth > 480 ? "15px" : "0",
                    marginBottom: window.innerWidth > 480 ? "0" : "10px"
                  }}
                />
                <div style={{ width: "100%" }}>
                  <h2 style={{ margin: "0 0 10px 0", fontSize: window.innerWidth > 480 ? "1.5rem" : "1.2rem" }}>{sw.name}</h2>
                  {(selectedFilters.includes("type") || sortField === "type") && (
                    <p>{displayLabels["type"]}: {sw.type}</p>
                  )}
                  {(selectedFilters.includes("mount") || sortField === "mount") && (
                    <p>{displayLabels["mount"]}: {sw.mount}</p>
                  )}
                  {(selectedFilters.includes("manufacturer") || sortField === "manufacturer") && (
                    <p>{displayLabels["manufacturer"]}: {sw.manufacturer}</p>
                  )}
                  {(selectedFilters.includes("lifetime") || sortField === "lifetime") && (
                    <p>{displayLabels["lifetime"]}: {sw.lifetime}</p>
                  )}
                  <Link to={`/switches/${sw._id}`} style={{ color: "#007BFF", textDecoration: "none" }}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Filter Options */}
        <div style={{ 
          flex: window.innerWidth > 768 ? "3" : "1",
          paddingLeft: window.innerWidth > 768 ? "20px" : "0",
          borderLeft: window.innerWidth > 768 ? "1px solid #ddd" : "none",
          borderBottom: window.innerWidth <= 768 ? "1px solid #ddd" : "none",
          paddingBottom: window.innerWidth <= 768 ? "20px" : "0"
        }}>
          <div className="filter-checklist" style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: window.innerWidth > 480 ? "1.5rem" : "1.2rem" }}>Select Properties to Filter</h2>
            <div style={{ 
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}>
              {availableFilters.map((field, idx) => (
                <label key={idx} style={{ 
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: window.innerWidth > 480 ? "1rem" : "0.9rem",
                  padding: "4px 0"
                }}>
                  <input
                    type="checkbox"
                    value={field}
                    checked={selectedFilters.includes(field)}
                    onChange={handleFilterSelection}
                    style={{
                      width: "16px",
                      height: "16px",
                      margin: "0",
                      flex: "0 0 auto"
                    }}
                  />
                  <span>{displayLabels[field]}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h2 style={{ fontSize: window.innerWidth > 480 ? "1.5rem" : "1.2rem" }}>Filter Options</h2>
            {selectedFilters.map((field, idx) => (
              <div key={idx} className="filter-group" style={{ 
                marginBottom: "15px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start"
              }}>
                <label style={{ 
                  fontWeight: "bold",
                  marginBottom: "8px",
                  alignSelf: "flex-start"
                }}>{displayLabels[field]}:</label>
                {field === "lubricated" ? (
                  <select
                    style={{ width: "100%" }}
                    name="lubricated"
                    value={filters.lubricated || "all"}
                    onChange={handleBooleanFilterChange}
                  >
                    <option value="all">All</option>
                    <option value="true">Lubricated</option>
                    <option value="false">Non-Lubricated</option>
                  </select>
                ) : (
                  <>
                    {uniqueValues[field] && uniqueValues[field].length < 5 ? (
                      <div style={{ 
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        marginTop: "8px",
                        width: "100%",
                        alignItems: "flex-start"
                      }}>
                        {uniqueValues[field].map((val, i) => (
                          <label key={i} style={{ 
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "4px 0"
                          }}>
                            <input
                              type="checkbox"
                              value={val}
                              onChange={(e) => handleCheckboxFilterChange(e, field)}
                              checked={
                                filters[field + "_checkbox"]
                                  ? filters[field + "_checkbox"].includes(val)
                                  : false
                              }
                              style={{
                                width: "16px",
                                height: "16px",
                                margin: "0",
                                flex: "0 0 auto"
                              }}
                            />
                            <span>{val}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input
                        style={{ width: "100%" }}
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

            <div className="filter-group" style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "8px"
            }}>
              <h3 style={{ alignSelf: "flex-start" }}>Sort Options</h3>
              <label style={{ width: "100%" }}>
                Sort By:
                <select 
                  value={sortField} 
                  onChange={handleSortFieldChange}
                  style={{ width: "100%", marginTop: "4px" }}
                >
                  <option value="">None</option>
                  {availableFilters.map((field, i) => (
                    <option key={i} value={field}>
                      {displayLabels[field]}
                    </option>
                  ))}
                </select>
              </label>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
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
        </div>
      </div>
    </div>
  );
}
