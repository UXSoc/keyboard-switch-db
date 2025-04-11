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

export default function SwitchesPage() {
  const [switches, setSwitches] = useState([]);
  const [filteredSwitches, setFilteredSwitches] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filters, setFilters] = useState({});
  const [uniqueValues, setUniqueValues] = useState({});
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  // Fetch the switches data and compute unique values for each field
  useEffect(() => {
    fetch("http://localhost:4000/api/switches")
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
    <div>
      <h1>Switch Gallery</h1>
      <div style={{ display: "flex", width: "90%", marginTop: "20px" }}>
        {/* Left Side: List View of Switches */}
        <div style={{ flex: "7", paddingRight: "20px" }}>
          <div
            className="gallery"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            {filteredSwitches.map((sw) => (
              <div
                key={sw._id}
                className="switch-card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                  boxSizing: "border-box",
                }}
              >
                <img
                  src={`http://localhost:4000${sw.thumbnail}`}
                  alt={sw.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                    borderRadius: "8px",
                    marginRight: "15px",
                  }}
                />
                <div>
                  <h2 style={{ margin: "0 0 10px 0" }}>{sw.name}</h2>
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
        <div style={{ flex: "3", paddingLeft: "20px", borderLeft: "1px solid #ddd" }}>
          <div className="filter-checklist" style={{ marginBottom: "20px" }}>
            <h2>Select Properties to Filter</h2>
            {availableFilters.map((field, idx) => (
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

          <div className="filter-section">
            <h2>Filter Options</h2>
            {selectedFilters.map((field, idx) => (
              <div key={idx} className="filter-group" style={{ marginBottom: "15px" }}>
                <label style={{ fontWeight: "bold" }}>{displayLabels[field]}:</label>
                {field === "lubricated" ? (
                  <select
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
                      <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {uniqueValues[field].map((val, i) => (
                          <label key={i} style={{ marginRight: "10px" }}>
                            <input
                              type="checkbox"
                              value={val}
                              onChange={(e) => handleCheckboxFilterChange(e, field)}
                              checked={
                                filters[field + "_checkbox"]
                                  ? filters[field + "_checkbox"].includes(val)
                                  : false
                              }
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
        </div>
      </div>
    </div>
  );
}
