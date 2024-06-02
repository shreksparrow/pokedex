const pokedex = document.getElementById('pokedex');
const searchInput = document.getElementById('search');
const typeFilter = document.getElementById('type-filter');

const types = [
    "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", 
    "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

// Populate type filter options
types.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.innerText = type.charAt(0).toUpperCase() + type.slice(1);
    typeFilter.appendChild(option);
});

const fetchPokemon = async () => {
    const promises = [];
    for (let i = 1; i <= 1010; i++) { // Adjust the number based on the latest number of Pokémon
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then((res) => res.json()));
    }
    const results = await Promise.all(promises);
    pokemon = results.map((data) => ({
        name: data.name,
        id: data.id,
        types: data.types.map((type) => type.type.name),
        sprite: data.sprites.front_default,
        hex: data.id.toString(16).padStart(3, '0'),
    }));
    displayPokemon(pokemon);
};

const displayPokemon = (pokemonList) => {
    const pokemonHTMLString = pokemonList
        .map(
            (pokeman) => `
        <div class="pokemon">
            <img src="${pokeman.sprite}" alt="${pokeman.name}" />
            <div class="name">${pokeman.name}</div>
            <div class="types">${pokeman.types.join(', ')}</div>
            <div class="id">DEC: ${pokeman.id} | HEX: ${pokeman.hex}</div>
        </div>
    `
        )
        .join('');
    pokedex.innerHTML = pokemonHTMLString;
};

const filterPokemon = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = typeFilter.value;
    
    const filteredPokemon = pokemon.filter((pokeman) => {
        const matchesSearchTerm = 
            pokeman.name.toLowerCase().includes(searchTerm) || 
            pokeman.id.toString().includes(searchTerm) || 
            pokeman.hex.includes(searchTerm);
        
        const matchesType = 
            selectedType === 'all' || 
            pokeman.types.includes(selectedType);
        
        return matchesSearchTerm && matchesType;
    });
    
    displayPokemon(filteredPokemon);
};

let pokemon = [];
fetchPokemon().then(() => {
    searchInput.addEventListener('input', filterPokemon);
    typeFilter.addEventListener('change', filterPokemon);
});
