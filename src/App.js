import React, { useState, useEffect } from 'react';
import axios from 'axios';
import poke from './assets/poke.png';

function App() {
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true); 
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 40;

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

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); 
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
          <h1 className="text-xl font-bold">Pokedex</h1>
        </div>
      </nav>

      <div className="container mx-auto p-4 mt-20 mb-12">
        <input
          type="text"
          placeholder="Search for a card"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-8 p-2 border-4 rounded-full w-full"
          style={{ textIndent: '20px' }} 
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {loading ? (
            <div className="flex flex-col justify-center items-center w-40 min-h-24 mt-12 ml-96">
              <div className="flex flex-col items-center justify-center">
                <div className="flex space-x-2 mb-4">
                  <div className="h-12 w-12 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-12 w-12 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-12 w-12 bg-gray-300 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          ) : currentCards.length > 0 ? (
            currentCards.map(card => (
              <div key={card.id} className="bg-white border border-gray-200 p-4 rounded-3xl shadow-2xl flex flex-col  transition-transform duration-300 ease-in-out transform hover:scale-105">
                <h2 className="text-2xl font-sans font-bold pb-2 text-sky-900 ">{card.name}</h2> <img
                  src={`https://img.pokemondb.net/artwork/${card.name.toLowerCase()}.jpg`}
                  alt={card.name}
                  className="w-full items-center h-44 object-cover rounded-lg  transition-transform duration-300 ease-in-out transform hover:scale-105"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                />
                
                
                <p className="text-sky-900 text-sm font-sans"><strong>HP:</strong> {card.hp}</p>
                <p className="text-sky-900 text-sm font-sans"><strong>Attacks:</strong> {card.attacks?.map(attack => attack.name).join(', ')}</p>
                <p className="text-sky-900 text-sm font-sans"><strong>Weaknesses:</strong> {card.weaknesses?.map(weakness => weakness.type).join(', ')}</p>
                <p className="text-sky-900 text-sm font-sans"><strong>Set:</strong> {card.set.name}</p>
                <div className="absolute bottom-4 right-4 bg-orange-300 text-amber-800 rounded-2xl w-16 h-10 flex items-center justify-center">
                <span className="text-xs font-bold">{card.id}</span>
              </div>
              </div>
            ))
          ) : (
            <p>No cards found</p>
          )}
        </div>
      </div>

      <footer className="bg-gray-800 text-white shadow-2xl fixed bottom-0 left-0 right-0 p-4 z-50">
        <div className="flex justify-center">
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 border rounded-full ${currentPage === index + 1 ? 'bg-gray-500 text-stone-100':'bg-stone-100 text-gray-700'}`}
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
