import React from 'react';

const PokemonCard = ({ pokemon }) => {
  return (
    <div className="pokemon">
      <img src={pokemon.image} alt={pokemon.name} />
      <div className="name">{pokemon.name}</div>
      <div className="id">#{pokemon.id}</div>
      <div className="types">
        {pokemon.types.map((type, index) => (
          <span key={index} className="type">{type}</span>
        ))}
      </div>
    </div>
  );
};

export default PokemonCard;
