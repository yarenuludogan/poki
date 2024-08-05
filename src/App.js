import React, { useState, useEffect } from 'react';
import axios from 'axios';
import poke from './assets/poke.png';
import { useNavigate } from 'react-router-dom';


function App() {
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true); 
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 40;
  const [sortBy, setSortBy] = useState('name');
  const navigate= useNavigate();
 

  useEffect(() => {
    setLoading(true); 
    axios.get('https://api.pokemontcg.io/v2/cards')
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
  }, []);

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

  const handleClick = (id) => {
    navigate(`/card/${id}`);
  };

  return (
    <div className="relative min-h-screen mb-20 ml-20 mr-20 ">
      <nav className="bg-gray-800 p-6 text-white h-24 shadow-2xl shadow-slate-500 flex items-center fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center">
          <img
            src={poke}
            alt="Pokémon Icon"
            className="h-16 w-16 mr-4 mb-4 ml-4"
          />
          <h1 className="text-3xl font-bold mb-6">Pokédex</h1>
        </div><div className="flex-grow flex justify-center ml-16 mr-12">
          <input
            type="text"
            placeholder="Search for a card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-8 mt-4 p-2 border-2 rounded-full w-full bg-gray-900 shadow-inner"
            style={{ textIndent:'20px'}} 
          />
          </div>
      </nav>
      
        <div className="container mx-auto p-4 mt-28 mb-12">
          
          <div className="flex justify-end mb-4">
            <select 
              onChange={handleSortChange} 
              value={sortBy} 
              className="p-2 border-2 rounded-3xl bg-gray-200 transition-transform duration-300 ease-in-out transform hover:scale-105 inner-shadow-3xl shadow-2xl shadow-gray-300"
            >
              <option className="text-gray-600" value="nameatoz">Sort by Name (A-Z)</option>
              <option className="text-gray-600" value="nameztoa">Sort by Name (Z-A)</option>
              <option className="text-gray-600" value="hphl">Sort by HP (High to Low)</option>
              <option className="text-gray-600" value="hplh">Sort by HP (Low to High)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {loading ? (
              
              <div className="col-span-full flex justify-center items-center mt-8">
              <div className="flex space-x-4">
                <div className="h-10 w-10 bg-gray-700 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-10 w-10 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-10 w-10 bg-gray-500 rounded-full animate-bounce"></div>
              </div>
            </div>
            
            ) : currentCards.length > 0 ? (
              currentCards.map(card => (
                <div key={card.id}
                 className="truncate ... border border-gray-200 p-4 rounded-3xl shadow-2xl shadow-gray-400 flex flex-col transition-transform duration-300 ease-in-out transform hover:scale-105"
                 onClick={() => handleClick(card.id)}>
                    <h2 className="text-2xl font-sans font-bold pb-2 text-sky-900">{card.name}</h2>
                  <img
                    
                    src={`https://img.pokemondb.net/artwork/${card.name.toLowerCase()}.jpg`}
                    alt={card.name} 
                    className=" items-center object-contain h-48 w-48  rounded-3xl transition-transform duration-300 ease-in-out transform hover:scale-105"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                  />
                  
                  <div className="object-scale-down-30">
                    <p className="text-sky-900 text-sm font-sans truncate ..."><strong>HP</strong> {card.hp}</p>
                   
                    <p className="text-sky-900 text-sm font-sans truncate ..."><strong>Weaknesses</strong> {card.weaknesses?.map(weakness => weakness.type).join(', ')}</p>
                    
                  </div>
                  
                  <div className="absolute bottom-2 right-2 text-gray-500 rounded-2xl w-12 h-8 flex items-center justify-center sm:w-14 sm:h-6 md:w-16 md:h-8 lg:w-18 lg:h-8 xl:w-20 xl:h-8">
                    {card.types.map((type, index) => (
                      <span
                        key={index}
                        className={`text-xs p-2 text-gray-900 drop-shadow-xl object cover rounded-2xl font-bold ${getTypeColor(type)}`} >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="ml-4 text-xl font-bold text-sky-900">No cards found</p>
            )}
          </div>
        </div>
      
      <footer className="bg-gray-800 text-stone-100 shadow-2xl shadow-slate-900 fixed bottom-0 left-0 right-0 p-4 z-50">
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
