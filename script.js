const poke_container = document.getElementById('poke-container');
const searchInput = document.getElementById('search-input');
const searchIcon = document.getElementById('search-icon');

const modal = document.getElementById('pokemon-modal');
const closeModal = document.getElementById('close-modal');
const modalImg = document.getElementById('modal-pokemon-img');
const modalName = document.getElementById('modal-pokemon-name');
const modalType = document.getElementById('modal-pokemon-type');
const modalId = document.getElementById('modal-pokemon-id');
const modalHp = document.getElementById('modal-pokemon-hp');
const modalAttack = document.getElementById('modal-pokemon-attack');
const modalDefense = document.getElementById('modal-pokemon-defense');
const modalSpeed = document.getElementById('modal-pokemon-speed');
const modalAbilities = document.getElementById('modal-pokemon-abilities');
const modalDesc = document.getElementById('modal-pokemon-desc'); // description element

const loadingScreen = document.getElementById('loading-screen');
const progressBar = document.getElementById('progress');
const progressText = document.getElementById('progress-text');

const pokemon_count = 1010;
const colors = {
  fire: '#FDDFDF',
  grass: '#DEFDE0',
  electric: '#FCF7DE',
  water: '#DEF3FD',
  ground: '#f4e7da',
  rock: '#d5d5d4',
  fairy: '#fceaff',
  poison: '#98d7a5',
  bug: '#f8d5a3',
  dragon: '#97b3e6',
  psychic: '#eaeda1',
  flying: '#F5F5F5',
  fighting: '#E6E0D4',
  normal: '#F5F5F5'
};

const main_types = Object.keys(colors);
let allPokemonData = [];

// Intersection Observer setup (fade-in on scroll)
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observerCallback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
};

const pokemonObserver = new IntersectionObserver(observerCallback, observerOptions);

// Pokémon data fetch & render
const getPokemon = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  return res.json();
};

const fetchPokemons = async () => {
  let loadedCount = 0;
  for (let i = 1; i <= pokemon_count; i++) {
    getPokemon(i).then(pokemon => {
      createPokemonCard(pokemon);
      allPokemonData.push(pokemon);
      loadedCount++;
      const percent = Math.floor((loadedCount / pokemon_count) * 100);
      progressBar.style.width = `${percent}%`;
      progressText.textContent = `${percent}%`;

      if (loadedCount === pokemon_count) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 800);
      }
    }).catch(() => {
      loadedCount++;
      const percent = Math.floor((loadedCount / pokemon_count) * 100);
      progressBar.style.width = `${percent}%`;
      progressText.textContent = `${percent}%`;
      if (loadedCount === pokemon_count) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 800);
      }
    });
  }
};

const createPokemonCard = (pokemon) => {
  const pokemonEl = document.createElement('div');
  pokemonEl.classList.add('pokemon');

  const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  const id = pokemon.id.toString().padStart(3, '0');

  const poke_types = pokemon.types.map(type => type.type.name);
  const type = main_types.find(type => poke_types.includes(type));
  const color = colors[type] || '#F5F5F5';
  pokemonEl.style.backgroundColor = color;

  pokemonEl.innerHTML = `
    <div class="img-container">
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${name}">
    </div>
    <div class="info">
      <span class="number">#${id}</span>
      <h3 class="Pokemonname">${name}</h3>
      
    </div>
  `;

  pokemonEl.addEventListener('click', () => {
    showPokemonDetails(pokemon);
  });
  poke_container.appendChild(pokemonEl);
  pokemonObserver.observe(pokemonEl);
};

const showPokemonDetails = (pokemon) => {
  const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  const id = pokemon.id.toString().padStart(3, '0');
  const poke_types = pokemon.types.map(type => type.type.name).join(', ');
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

  const hp = pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat;
  const attack = pokemon.stats.find(stat => stat.stat.name === 'attack').base_stat;
  const defense = pokemon.stats.find(stat => stat.stat.name === 'defense').base_stat;
  const speed = pokemon.stats.find(stat => stat.stat.name === 'speed').base_stat;

  const abilities = pokemon.abilities.map(ability => ability.ability.name);


  modalImg.src = imageUrl;
  modalName.textContent = name;
  modalType.textContent = poke_types;
  modalId.textContent = `#${id}`;
  modalHp.textContent = hp;
  modalAttack.textContent = attack;
  modalDefense.textContent = defense;
  modalSpeed.textContent = speed;

  modalAbilities.innerHTML = '';
  abilities.forEach(ability => {
    const abilityItem = document.createElement('li');
    abilityItem.textContent = ability;
    modalAbilities.appendChild(abilityItem);
  });


  fetch(pokemon.species.url)
    .then(res => res.json())
    .then(speciesData => {
      const flavorEntry = speciesData.flavor_text_entries.find(
        entry => entry.language.name === 'en'
      );
      let description = 'No description available.';
      if (flavorEntry) {
        description = flavorEntry.flavor_text.replace(/\f|\n/g, ' ');
      }
      modalDesc.textContent = description;
    })
    .catch(() => {
      modalDesc.textContent = 'Description not found.';
    });

  
  modal.classList.add('show');
};

closeModal.onclick = () => {
  modal.classList.remove('hide');
};
window.onclick = (event) => {
  if (event.target === modal) {
    modal.classList.remove('hide');
  }
};


const closeWithAnimation = () => {
 
  if (!modal.classList.contains('show')) return;


  modal.classList.add('hide');
  
  modal.addEventListener('animationend', function handler(event) {
  	
    if (event.animationName === 'fadeOutScale') {
      modal.classList.remove('show');
      modal.classList.remove('hide');
   
      modal.removeEventListener('animationend', handler);
    }
  });
};

closeModal.onclick = () => {
  closeWithAnimation();
};

window.onclick = (event) => {
  if (event.target === modal) {
    closeWithAnimation();
  }
};
// Search functionality (same as before)
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  poke_container.innerHTML = '';
  const filteredPokemon = allPokemonData.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm)
  );
  if (filteredPokemon.length === 0) {
    poke_container.innerHTML = '<p>No Pokémon found.</p>';
  } else {
    filteredPokemon.forEach(pokemon => createPokemonCard(pokemon));
  }
});


const loadingText = document.getElementById('loading-text');

const messages = [
 "🔍 Fetching Pokémon Server...",
  "📦 Fetching Details...",
  "🧿 Initializing Pokédex..."
];

let index = 0;

function updateLoadingText() {
  loadingText.style.opacity = 0; 

  setTimeout(() => {
    loadingText.textContent = messages[index];
    loadingText.style.opacity = 1; 

    index++;
    if (index < messages.length) {
      setTimeout(updateLoadingText, 1100); 
    }
  }, 350); 
}

setTimeout(updateLoadingText, 350);


fetchPokemons();

