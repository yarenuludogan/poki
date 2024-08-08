import React, { useState, useEffect } from 'react';
import axios from 'axios';
import poke from './assets/poke.png';
import { useNavigate } from 'react-router-dom';
   


/*
   
  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'grass': return 'bg-grass';
      case 'fire': return 'bg-fire';
      case 'water': return 'bg-water';
      case 'lightning': return 'bg-lightning';
      case 'psychic': return 'bg-psychic';
      case 'fighting': return 'bg-fighting';
      case 'darkness': return 'bg-darkness';
      case 'metal': return 'bg-metal';
      case 'fairy': return 'bg-fairy';
      case 'dragon': return 'bg-dragon';
      case 'colorless': return 'bg-colorless';
      default: return 'bg-white'; // Varsayılan arka plan rengi
    }
  };

 
  const backgroundColorClass = card.types.length > 0 ? getTypeColor(card.types[0]) : 'bg-white';*/


function App() {
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const cardsPerPage = 40;
  const [sortBy, setSortBy] = useState('nameatoz');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);



  function Modal({ card, onClose }) {
    const [activeTab, setActiveTab] = useState('about');
  
    if (!card) return null;
  
    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };
  
    const getBarWidth = (value, max) => `${Math.min((value / max) * 100, 100)}%`;
  
    
    const typeColor = card.types && card.types.length > 0 ? getTypeColor(card.types[0]) : 'bg-gray-100';
  
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className={`bg-white rounded-3xl shadow-lg max-w-lg w-full relative flex flex-col space-y-4 p-4 ${typeColor}`}>
          <button className="absolute top-0 right-0 p-4" onClick={onClose}>
            X
          </button>
          <h2 className="text-3xl font-bold text-center text-gray-700">{card.name}</h2>
          <div className={`ml-1 mr-1 w-24 bg-amber-100 rounded-3xl ${typeColor}`}>
            <h2 className="text-m font-bold ml-6 text-gray-700">TYPES</h2>
          </div>
          <h2 className="text-xl font-bold absolute top-12 right-12 text-gray-700"># {card.number}</h2>
          <img
            src={`https://img.pokemondb.net/artwork/${card.name.toLowerCase()}.jpg`}
            alt={card.name}
            className="h-48 w-48 mb-4 mx-auto"
          />
  
          <div className="flex flex-row justify-center mb-4">
            <button
              type="button"
              className={`py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-3xl border border-transparent ${activeTab === 'about' ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-800 hover:bg-gray-200'} focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none`}
              onClick={() => handleTabClick('about')}
            >
              Base Stats
            </button>
            <button
              type="button"
              className={`py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-3xl border border-transparent ${activeTab === 'attacks' ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-800 hover:bg-gray-200'} focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none`}
              onClick={() => handleTabClick('attacks')}
            >
              About
            </button>
            <button
              type="button"
              className={`py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-3xl border border-transparent ${activeTab === 'abilities' ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-800 hover:bg-gray-200'} focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none`}
              onClick={() => handleTabClick('abilities')}
            >
              Abilities
            </button>
          </div>
  
          <div className="inline-flex items-center justify-center w-full mb-4">
            <hr className="w-80 h-px bg-gray-300 border-2 rounded-xl dark:bg-gray-700" />
          </div>
  
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {activeTab === 'about' && (
              <div className={`flex-1 bg-amber-100 p-4 rounded-3xl shadow-lg ${typeColor}`}>
                <div className="flex flex-col ml-2 mr-2 space-y-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-gray-700 text-sm font-sans">
                      <strong>Level</strong>
                    </p>
                    <div className="bg-stone-100 h-2 rounded-full">
                      <div
                        className="bg-orange-400 h-2 rounded-full"
                        style={{ width: getBarWidth(parseInt(card.level, 10), 100) }}
                      ></div>
                    </div>
                  </div>
  
                  <div className="flex flex-col space-y-1">
                    <p className="text-gray-700 text-sm font-sans">
                      <strong>HP</strong>
                    </p>
                    <div className="bg-stone-100 h-2 rounded-full ">
                      <div
                        className="bg-orange-700 h-2 rounded-full"
                        style={{ width: getBarWidth(parseInt(card.hp, 10), 100) }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    {card.attacks?.map((attack, index) => (
                      <div key={index} className="mb-2">
                        <p className="text-gray-700 text-sm font-bold truncate">{attack.name}</p>
                        <div className="bg-stone-100 h-2 rounded-full mt-1">
                          <div
                            className="bg-orange-800 h-2 rounded-full"
                            style={{ width: getBarWidth(parseInt(attack.damage, 10) || 0, 100) }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="flex flex-col space-y-2">
                      {card.weaknesses && card.weaknesses.length > 0 && (
                        <div>
                          <p className="text-gray-700 text-sm font-sans">
                            <strong>Weakness</strong>
                          </p>
                          {card.weaknesses.map((weakness, index) => (
                            <div key={index} className="mb-1">
                              <div className="bg-stone-100 h-2 rounded-full">
                                <div
                                  className="bg-red-500 h-2 rounded-full"
                                  style={{ width: getBarWidth(parseInt(weakness.value, 10) || 0, 100) }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {card.resistances && card.resistances.length > 0 && (
                        <div>
                          <p className="text-gray-700 text-sm font-bold">
                            {card.resistances.map((resistance) => resistance.type).join(', ')}
                          </p>
                          {card.resistances.map((resistance, index) => (
                            <div key={index} className="mb-1">
                              <div className="bg-stone-100 h-2 rounded-full" style={{ direction: 'rtl' }}>
                                <div
                                  className="bg-orange-600 h-2 rounded-full"
                                  style={{
                                    width: getBarWidth(Math.abs(parseInt(resistance.value, 10)) || 0, 100),
                                    transform: 'scaleX(-1)',
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-gray-700 text-sm font-sans">
                      <strong>Total</strong>
                    </p>
                    <div className="bg-stone-100 h-2 rounded-full">
                      <div
                        className="bg-orange-200 h-2 rounded-full"
                        style={{ width: getBarWidth(card.set.total || 0, 150) }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
  
            {activeTab === 'attacks' && (
              <div className={`flex-1 bg-amber-100 p-4 rounded-3xl shadow-lg ${typeColor}`}>
                <img
                  src={`https://images.pokemontcg.io/${card.set.id}/symbol.png`}
                  alt="Symbol"
                  className="w-16 h-16 absolute bottom-40 right-12"
                />
                <div className="mt-2">
                  <div className="flex">
                    <div className="flex-1 text-gray-700 <text-sm font-sans">
                      <p className="">
                        <strong>ID</strong>
                      </p>
                      <p>{card.id}</p>
                    </div>
                    <div className="flex-1 text-gray-700 text-sm font-sans">
                      <p className="">
                        <strong>Number</strong>
                      </p>
                      <p>{card.number}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-1 text-gray-700 text-sm font-sans">
                      <p className="">
                        <strong>Supertype</strong>
                      </p>
                      <p>{card.supertype}</p>
                    </div>
                    <div className="flex-1 text-gray-700 text-sm font-sans">
                      <p className="">
                        <strong>Level</strong>
                      </p>
                      <p>{card.level}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-1 text-gray-700 text-sm font-sans">
                      <p className="">
                        <strong>Artist</strong>
                      </p>
                      <p>{card.artist}</p>
                    </div>
                    <div className="flex-1 text-gray-700 text-sm font-sans">
                      <p className="">
                        <strong>Rarity</strong>
                      </p>
                      <p>{card.rarity}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-1 text-gray-700 text-sm font-sans">
                      <p className="">
                        <strong>Type</strong>
                      </p>
                      <p>{card.types.join(', ')}</p>
                    </div>
                    <div className="flex-1 text-gray-700 text-sm font-sans">
                      <p className="">
                        <strong>Subtype</strong>
                      </p>
                      <p>{card.subtypes?.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'abilities' && (
              <div className={`flex-1 bg-amber-100 p-4 rounded-3xl shadow-lg ${typeColor}`}>
                {card.abilities?.map((ability, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="text-gray-700 text-sm font-bold">{ability.name}</h3>
                    <p className="text-gray-700 text-sm">{ability.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  


  useEffect(() => {
    setLoading(true);
    axios.get(`https://api.pokemontcg.io/v2/cards?page=${currentPage}&pageSize=${cardsPerPage}`)
      .then(response => {
        if (response.data && response.data.data) {
          setCards(prevCards => [...prevCards, ...response.data.data]);
          setTotalPages(Math.ceil(response.data.total / cardsPerPage));
        } else {
          console.error('No data found in response:', response);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error while fetching data:', error);
        setLoading(false);
      });
  }, [currentPage]);
  
  

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

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

  const handleClick = (card) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCard(null);
  };

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedCards = filteredCards.slice().sort((a, b) => {
    if (sortBy === 'nameatoz') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'nameztoa') {
      return b.name.localeCompare(a.name);
    } else if (sortBy === 'hphl') {
      return b.hp - a.hp;
    } else if (sortBy === 'hplh') {
      return a.hp - b.hp;
    }
    return 0;
  });
  
  return (
    <div className="relative min-h-screen mb-20 ml-20 mr-20">
      <nav className="bg-gray-800 p-6 text-white h-24 shadow-2xl shadow-slate-500 flex items-center fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center">
          <img
            src={poke}
            alt="Pokémon Icon"
            className="h-16 w-16 mr-4 mb-4 ml-4"
          />
          <h1 className="text-3xl font-bold mb-6">Pokédex</h1>
        </div>
        <div className="flex-grow flex justify-center ml-16 mr-12">
          <input
            type="text"
            placeholder="What Pokémon are you looking for?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-8 mt-4 p-2 border-2 rounded-full w-full bg-gray-900 shadow-inner"
            style={{ textIndent: '20px' }}
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
          ) : sortedCards.length > 0 ? (
            sortedCards.map(card => (
              <div
                key={card.id}
                className="truncate ... border border-gray-200 p-4 rounded-3xl shadow-2xl shadow-gray-400 flex flex-col transition-transform duration-300 ease-in-out transform hover:scale-105"
                onClick={() => handleClick(card)}
              >
                <h2 className="text-2xl font-sans font-bold pb-2 text-sky-900">{card.name}</h2>
                <img
                  src={`https://img.pokemondb.net/artwork/${card.name.toLowerCase()}.jpg`}
                  alt={card.name}
                  className="items-center object-contain h-48 w-48 rounded-3xl transition-transform duration-300 ease-in-out transform hover:scale-105"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                />
                <div className="object-scale-down-30">
                  <p className="text-sky-900 text-sm font-sans truncate ..."><strong>HP</strong> {card.hp}</p>
                  <p className="text-sky-900 text-sm font-sans truncate ..."><strong>Weaknesses</strong> {card.weaknesses?.map(weakness => weakness.type).join(', ')}</p>
                </div>
                <div className="absolute bottom-2 right-2 text-gray-900 rounded-2xl w-12 h-8 flex items-center justify-center sm:w-14 sm:h-6 md:w-16 md:h-8 lg:w-18 lg:h-8 xl:w-20 xl:h-8">
                  {card.types.map((type, index) => (
                    <span
                      key={index}
                      className={`${getTypeColor(type)} inline-block py-1 px-2 mx-1 rounded-2xl text-sm font-bold`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center mt-8">
              <p>No cards found.</p>
            </div>
          )}
        </div>
        {loading ? (
          <div className="col-span-full flex justify-center items-center mt-8">
            
            
          </div>
        ) : (

        <div className="flex justify-center mt-12">
          <button
            className={`px-4 py-2 mx-2 rounded-full ${currentPage === 1 ? 'bg-gray-200' : 'bg-gray-900 text-white'}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`px-4 py-2 mx-2 rounded-full ${currentPage === index + 1 ? 'bg-gray-200 text-white' : 'bg-gray-900'}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={`px-4 py-2 mx-2 rounded-full ${currentPage === totalPages ? 'bg-gray-200' : 'bg-gray-900 text-white'}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        )}
      </div>


      {modalOpen && <Modal card={selectedCard} onClose={closeModal} />}
    </div>
  );
}

export default App;
