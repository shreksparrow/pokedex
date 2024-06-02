const pokedex = document.getElementById('pokedex');
const searchInput = document.getElementById('search');

const fetchPokemon = () => {
    const promises = [];
    for (let i = 1; i <= 1010; i++) { // Adjust the number based on the latest number of Pokémon
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then((res) => res.json()));
    }
    Promise.all(promises).then((results) => {
        const pokemon = results.map((data) => ({
            name: data.name,
            id: data.id,
            types: data.types.map((type) => type.type.name).join(', '),
            sprite: data.sprites.front_default,
            hex: data.id.toString(16).padStart(3, '0'),
        }));
        displayPokemon(pokemon);
    });
};

const displayPokemon = (pokemon) => {
    const pokemonHTMLString = pokemon
        .map(
            (pokeman) => `
        <div class="pokemon">
            <img src="${pokeman.sprite}" alt="${pokeman.name}" />
            <div class="name">${pokeman.name}</div>
            <div class="types">${pokeman.types}</div>
            <div class="id">DEC: ${pokeman.id} | HEX: ${pokeman.hex}</div>
        </div>
    `
        )
        .join('');
    pokedex.innerHTML = pokemonHTMLString;
};

const filterPokemon = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredPokemon = pokemon.filter((pokeman) =>
        pokeman.name.toLowerCase().includes(searchTerm)
    );
    displayPokemon(filteredPokemon);
};

let pokemon = [];
fetchPokemon().then(() => {
    searchInput.addEventListener('input', filterPokemon);
});
