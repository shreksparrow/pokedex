import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import FilterOptions from './FilterOptions';
import PokemonCard from './PokemonCard';
import './styles.css';

const Pokedex = () => {
  const [pokemons, setPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState([]);
  const [sortOption, setSortOption] = useState('id-asc');

  useEffect(() => {
    // Fetch Pokémon data
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then(response => response.json())
      .then(data => {
        // Map fetched data to include necessary properties
        setPokemons(data.results.map((pokemon, index) => ({
          id: index + 1,
          name: pokemon.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
          types: [] // To be populated with another API call if necessary
        })));
      });
  }, []);

  // Handle search, filter, and sort here...

  return (
    <div>
      <h1>Pokedex</h1>
      <SearchBar onSearch={(e) => setSearchTerm(e.target.value)} />
      <FilterOptions 
        types={['Grass', 'Fire', 'Water', 'Bug', 'Normal']} 
        onTypeChange={(e) => setFilterType([...e.target.selectedOptions].map(option => option.value))}
        onSortChange={(e) => setSortOption(e.target.value)}
      />
      <div id="pokedex">
        {pokemons.filter(pokemon => 
          pokemon.name.includes(searchTerm) &&
          (filterType.length === 0 || filterType.some(type => pokemon.types.includes(type)))
        ).sort((a, b) => {
          if (sortOption === 'id-asc') return a.id - b.id;
          if (sortOption === 'id-desc') return b.id - a.id;
          if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
          if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
          return 0;
        }).map(pokemon => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
};

export default Pokedex;
