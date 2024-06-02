const pokedex = document.getElementById('pokedex');
const searchInput = document.getElementById('search');
const typeFilter = document.getElementById('type-filter');
const sortOptions = document.getElementById('sort-options');
const extraFilters = document.getElementById('extra-filters');

const types = [
    "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison",
    "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

const extraFilterOptions = [
    { value: "mythical", label: "Mythical" },
    { value: "legendary", label: "Legendary" },
    { value: "pseudo-legendary", label: "Pseudo-Legendary" }
];

// Populate type filter options
types.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.innerText = type.charAt(0).toUpperCase() + type.slice(1);
    typeFilter.appendChild(option);
});

// Populate extra filters
extraFilterOptions.forEach(filter => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = filter.value;
    checkbox.id = filter.value;
    const label = document.createElement('label');
    label.for = filter.value;
    label.innerText = filter.label;
    extraFilters.appendChild(checkbox);
    extraFilters.appendChild(label);
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
        generation: getGeneration(data.id),
        mythical: isMythical(data),
        legendary: isLegendary(data),
        pseudoLegendary: isPseudoLegendary(data)
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
            <div class="generation">Generation: ${pokeman.generation}</div>
            <div class="status">${pokeman.mythical ? 'Mythical' : pokeman.legendary ? 'Legendary' : pokeman.pseudoLegendary ? 'Pseudo-Legendary' : ''}</div>
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
    const selectedExtraFilters = Array.from(extraFilters.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value);

    let filteredPokemon = pokemon.filter((pokeman) => {
        const matchesSearchTerm = 
            pokeman.name.toLowerCase().includes(searchTerm) || 
            pokeman.id.toString().includes(searchTerm) || 
            pokeman.hex.includes(searchTerm);
        
        const matchesType = 
            selectedTypes.length === 0 || 
            selectedTypes.every(type => pokeman.types.includes(type));

        const matchesExtraFilters = 
            selectedExtraFilters.length === 0 || 
            selectedExtraFilters.every(filter => pokeman[filter]);
        
        return matchesSearchTerm && matchesType && matchesExtraFilters;
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

const getGeneration = (id) => {
    if (id <= 151) return 1;
    if (id <= 251) return 2;
    if (id <= 386) return 3;
    if (id <= 493) return 4;
    if (id <= 649) return 5;
    if (id <= 721) return 6;
    if (id <= 809) return 7;
    return 8;
};

const isMythical = (data) => {
    // Example condition
    return data.is_mythical;
};

const isLegendary = (data) => {
    // Example condition
    return data.is_legendary;
};

const isPseudoLegendary = (data) => {
    // Example condition for pseudo-legendary Pokémon
    const pseudoLegendaryList = [149, 248, 373, 376, 445, 635, 706, 784, 887]; // Add appropriate IDs
    return pseudoLegendaryList.includes(data.id);
};

fetchPokemon();

searchInput.addEventListener('input', filterAndDisplayPokemon);
typeFilter.addEventListener('change', filterAndDisplayPokemon);
sortOptions.addEventListener('change', filterAndDisplayPokemon);
extraFilters.addEventListener('change', filterAndDisplayPokemon);
