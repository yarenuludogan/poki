import React, { useState, useEffect } from 'react';
import axios from 'axios';
import poke from './assets/poke.png';

function App() {
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true); 
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 40;
  const [sortBy, setSortBy] = useState('name');

  const API_KEY="633eb196-a28a-4265-acc0-378d1e382004";

  useEffect(() => {
    setLoading(true); 
    axios.get('https://api.pokemontcg.io/v2/cards', {
      headers: { 'X-Api-Key': API_KEY } 
    })
      .then(response => {
        if (response.data && response.data.data) {
          setCards(response.data.data);
        } else {
          console.error('No data found in response:', response);
        }
        setLoading(false); 
      })
      .catch(error => {
        console.error('Error while fetching data:', error);
        setLoading(false); 
      });
  }, [API_KEY]);

  const filteredCards = search
    ? cards.filter(card =>
        card.name.toLowerCase().includes(search.toLowerCase().trim())
      )
    : cards;

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const sortedCards = [...filteredCards].sort((a, b) => {
    if (sortBy === 'nameatoz') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'hphl') {
      return b.hp - a.hp; 
    } else if (sortBy === 'hplh') {
      return a.hp - b.hp; 
    } else if (sortBy === 'nameztoa') {
      return b.name.localeCompare(a.name); 
    }
    return 0;
  });

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = sortedCards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(sortedCards.length / cardsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); 
  };

  const typeColors = {
    Grass: 'bg-lime-100',
    Fire: 'bg-red-100',
    Water: 'bg-sky-100',
    Lightning: 'bg-yellow-100',
    Psychic: 'bg-purple-100',
    Fighting: 'bg-orange-100',
    Darkness: 'bg-stone-300',
    Metal: 'bg-gray-300',
    Fairy: 'bg-pink-100',
    Dragon: 'bg-yellow-100',
    Colorless: 'bg-gray-400'
  };

  const getTypeColor = (type) => {
    return typeColors[type] || 'bg-gray-100'; 
  };

  return (
    <div className="relative min-h-screen mb-20">
      <nav className="bg-gray-800 p-4 text-white shadow-2xl flex items-center fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center">
          <img
            src={poke}
            alt="Pokémon Icon"
            className="h-8 w-8 mr-2"
          />
          <h1 className="text-xl font-bold">Pokédex</h1>
        </div>
      </nav>
      <div className="">
        <div className="container mx-auto p-4 mt-20 mb-12 ">
          <input
            type="text"
            placeholder="Search for a card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-8 p-2 border-4 rounded-full w-full"
            style={{ textIndent:'20px'}} 
          />
          <div className="flex justify-end mb-4">
            <select 
              onChange={handleSortChange} 
              value={sortBy} 
              className="p-2 border-2 rounded-3xl bg-gray-200 transition-transform duration-300 ease-in-out transform hover:scale-105 inner-shadow-3xl"
            >
              <option className="text-gray-600" value="nameatoz">Sort by Name (A-Z)</option>
              <option className="text-gray-600" value="nameztoa">Sort by Name (Z-A)</option>
              <option className="text-gray-600" value="hphl">Sort by HP (High to Low)</option>
              <option className="text-gray-600" value="hplh">Sort by HP (Low to High)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {loading ? (
              <div className="flex flex-col justify-center items-center w-40 min-h-24 mt-12 ml-96 ">
                <div className="flex flex-col items-center justify-center">
                  <div className="flex space-x-2 mb-4">
                    <div className="h-10 w-10 bg-gray-700 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-10 w-10 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-10 w-10 bg-gray-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            ) : currentCards.length > 0 ? (
              currentCards.map(card => (
                <div key={card.id} className="truncate ... border border-gray-200 p-4 rounded-3xl shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform hover:scale-105">
                  <h2 className="text-2xl font-sans font-bold pb-2 text-sky-900">{card.name}</h2>
                  <img
                    src={`https://img.pokemondb.net/artwork/${card.name.toLowerCase()}.jpg`}
                    alt={card.name} 
                    className="w-full items-center object-contain h-40 w-40 object-cover rounded-3xl transition-transform duration-300 ease-in-out transform hover:scale-105"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                  />
                  
                  <div className="">
                    <p className="text-sky-900 text-sm font-sans truncate ..."><strong>HP:</strong> {card.hp}</p>
                    <p className="text-sky-900 text-sm font-sans truncate ..."><strong>Attacks:</strong> {card.attacks?.map(attack => attack.name).join(', ')}</p>
                    <p className="text-sky-900 text-sm font-sans truncate ..."><strong>Weaknesses:</strong> {card.weaknesses?.map(weakness => weakness.type).join(', ')}</p>
                    <p className="text-sky-900 text-sm font-sans truncate ..."><strong>Set:</strong> {card.set.name}</p>
                  </div>
                  
                  <div className="absolute bottom-2 right-2 text-gray-500 rounded-2xl w-12 h-8 flex items-center justify-center sm:w-14 sm:h-6 md:w-16 md:h-8 lg:w-18 lg:h-8 xl:w-20 xl:h-8">
                    {card.types.map((type, index) => (
                      <span
                        key={index}
                        className={`text-xs p-2 text-gray-900 drop-shadow-xl truncate rounded-2xl font-sans ${getTypeColor(type)}`} >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p>No cards found</p>
            )}
          </div>
        </div>
      </div>
      <footer className="bg-gray-800 text-stone-100 tsxt-bold shadow-2xl fixed bottom-0 left-0 right-0 p-4 z-50">
        <div className="flex justify-center">
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 border-2 hover:border-t-2 shadow-2xl rounded-full ${currentPage === index + 1 ? 'bg-gray-500 text-stone-100' : 'bg-stone-100 text-gray-700'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
