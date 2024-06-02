// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPokemon = async () => {
      let allPokemon = [];
      for (let i = 1; i <= 898; i++) { // Up to Generation 8
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
        const speciesRes = await axios.get(res.data.species.url);
        const generation = speciesRes.data.generation.name;
        allPokemon.push({ ...res.data, generation });
      }
      setPokemonList(allPokemon);
    };

    fetchPokemon();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPokemon = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="App">
      <h1>Pokédex</h1>
      <input
        type="text"
        placeholder="Search Pokémon"
        onChange={handleSearch}
        value={searchTerm}
      />
      <div className="pokemon-list">
        {filteredPokemon.map((pokemon) => (
          <div key={pokemon.id} className="pokemon-card">
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <p>{capitalize(pokemon.name)}</p>
            <p>Types: {pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
            <p>Generation: {pokemon.generation.replace('generation-', '').toUpperCase()}</p>
            <p>DEC ID: {pokemon.id}</p>
            <p>HEX ID: {pokemon.id.toString(16).toUpperCase()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
