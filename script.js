const pokedex = document.getElementById('pokedex');
const searchInput = document.getElementById('search');
const typeFilter = document.getElementById('type-filter');
const sortOptions = document.getElementById('sort-options');

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

let pokemon = [];

const fetchPokemon = async () => {
    const promises = [];
    for (let i = 1; i <= 1010; i++) { // Adjust the number based on the latest number of Pokémon
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then((res) => res.json()).catch(err => console.error(`Failed to fetch data for Pokémon ${i}:`, err)));
    }
    const results = await Promise.all(promises);
    pokemon = results.map((data) => ({
        name: data.name,
        id: data.id,
        types: data.types.map((type) => type.type.name),
        sprite: data.sprites.front_default,
        hex: data.id.toString(16).padStart(3, '0'),
    }));
    filterAndDisplayPokemon();
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

const filterAndDisplayPokemon = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedTypes = Array.from(typeFilter.selectedOptions).map(option => option.value);
    const sortOption = sortOptions.value;

    let filteredPokemon = pokemon.filter((pokeman) => {
        const matchesSearchTerm = 
            pokeman.name.toLowerCase().includes(searchTerm) || 
            pokeman.id.toString().includes(searchTerm) || 
            pokeman.hex.includes(searchTerm);
        
        const matchesType = 
            selectedTypes.length === 0 || 
            selectedTypes.some(type => pokeman.types.includes(type));
        
        return matchesSearchTerm && matchesType;
    });

    // Sorting
    filteredPokemon = filteredPokemon.sort((a, b) => {
        if (sortOption === 'id-asc') return a.id - b.id;
        if (sortOption === 'id-desc') return b.id - a.id;
        if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
        if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
    });

    displayPokemon(filteredPokemon);
};

fetchPokemon().then(() => {
    searchInput.addEventListener('input', filterAndDisplayPokemon);
    typeFilter.addEventListener('change', filterAndDisplayPokemon);
    sortOptions.addEventListener('change', filterAndDisplayPokemon);
});
