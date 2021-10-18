// DOM Objects
const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeShinyImage = document.querySelector('.poke-shiny-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeHeight = document.querySelector('.poke-height');
const pokeWeight = document.querySelector('.poke-weight');

const pokeListItems = document.querySelectorAll('.list-item');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');


// Constants & Variables
// All Pokemon types
const TYPES = [
  'normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'
];

let prevUrl = null;
let nextUrl = null;

// Functions

// Get data for Pokedex list (right side)
function fetchPokedexList(url) {
  fetch(url)
  .then(res => res.json())
  .then(data => {
    
    const { results, previous, next } = data;
    prevUrl = previous;
    nextUrl = next;

    for (let i = 0; i < pokeListItems.length; i++) {
      const pokeListItem = pokeListItems[i];
      const resultData = results[i];

      if (resultData) {
        const { name, url } = resultData;
        const urlArray = url.split('/');
        const id = urlArray[urlArray.length - 2];
        pokeListItem.textContent = id + '. ' + name;
      } else {
        pokeListItem.textContent = '';
      }
    }
  });
};

// Get data for Pokedex entry (left side)
function fetchPokedexEntry(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
  .then(res => res.json())
  .then(data => {
    
    resetScreen()

    const dataTypes = data['types'];
    const dataFirstType = dataTypes[0];
    const dataSecondType = dataTypes[1];

    pokeTypeOne.textContent = dataFirstType['type']['name'];
    if (dataSecondType) {
      pokeTypeTwo.classList.remove('hide');
      pokeTypeTwo.textContent = dataSecondType['type']['name'];
    } else {
      pokeTypeTwo.classList.add('hide');
      pokeTypeTwo.textContent = '';
    }

    mainScreen.classList.add(dataFirstType['type']['name']);
    
    pokeName.textContent = data['name'];
    pokeId.textContent = '#' + data['id'].toString().padStart(3, '0');
    pokeHeight.textContent = (data['height'] / 10) + 'm';
    pokeWeight.textContent = (data['weight'] / 10) + 'kg';
    pokeFrontImage.src = data['sprites']['front_default'];
    pokeShinyImage.src = data['sprites']['front_shiny'];
  });
}

// Next button click
function handleNextButtonClick() {
  if (nextUrl) {
    fetchPokedexList(nextUrl);
  }
};

// Previous Button click
function handlePrevButtonClick() {
    if (prevUrl) {
      fetchPokedexList(prevUrl);
    }
};

// Clicking on a pokemon from the Pokedex list
function handlePokedexListClick(e) {
  if (!e.target) return;

  const pokedexItem = e.target;
  if (!pokedexItem.textContent) return;

  const id = pokedexItem.textContent.split('.')[0];
  fetchPokedexEntry(id);
};

// Remove previous the Pokemon's typing for Pokedex background color
function resetScreen() {
  mainScreen.classList.remove('hide');

  for (const type of TYPES) {
    mainScreen.classList.remove(type);
  }
};

// Event listeners
prevButton.addEventListener('click', handlePrevButtonClick);
nextButton.addEventListener('click', handleNextButtonClick);
// Functionality for Pokedex list
for (const pokeListItem of pokeListItems) {
  pokeListItem.addEventListener('click', handlePokedexListClick);
};

// Initialize App
fetchPokedexList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');