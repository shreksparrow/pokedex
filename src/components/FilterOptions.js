import React from 'react';

const FilterOptions = ({ types, onTypeChange, onSortChange }) => {
  return (
    <div className="filter-options">
      <select onChange={onTypeChange} multiple>
        {types.map((type, index) => (
          <option key={index} value={type}>{type}</option>
        ))}
      </select>
      <select onChange={onSortChange}>
        <option value="id-asc">ID (Ascending)</option>
        <option value="id-desc">ID (Descending)</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
      </select>
    </div>
  );
};

export default FilterOptions;
