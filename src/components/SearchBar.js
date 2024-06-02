import React from 'react';

const SearchBar = ({ onSearch }) => {
  return (
    <div className="search-container">
      <input type="text" placeholder="Search for a Pokémon by name, DEC or HEX..." onChange={onSearch} />
    </div>
  );
};

export default SearchBar;
