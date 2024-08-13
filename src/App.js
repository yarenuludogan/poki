import React, { useState, useEffect , useRef} from 'react';
import axios from 'axios';
import poke from './assets/poke.png';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';

function App() {
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 20;
  const [sortBy, setSortBy] = useState('nameatoz');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

   useEffect(() => {
    window.scrollTo(0, 0);
   }, []);

    const handleScroll = () => {
      if (window.scrollY > 100) { 
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

  function Modal({ card, onClose }) {
    const [activeTab, setActiveTab] = useState('about');
  
    if (!card) return null;
  
    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };
  
    const getBarWidth = (value, max) => `${Math.min((value / max) * 100, 100)}%`;
  
    
    const typeColor = card.types && card.types.length > 0 ? getTypeColor(card.types[0]) : 'bg-gray-100';
    const barColors = card.types && card.types.length > 0 ? getBarColor(card.types[0]) : 'bg-gray-100';

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-inner max-w-lg w-full relative mt-4 mb-4 flex flex-col space-y-4 p-6 md:p-8 lg:p-10 xl:p-12 md:mt-4 md:mb-4 sm:mt-2 sm:mb-2">
            <button className="absolute top-0 right-0 p-4" onClick={onClose}>
              X
            </button>
            <h2 className="text-3xl font-bold text-center text-gray-700">{card.name}</h2>
             <div className={`ml-1  w-24 rounded-3xl shadow-xl mr-2 ${typeColor}`}>
             <h2 className={`text-m font-bold ml-4 text-gray-700 `}>
               {card.types.join(', ')}
             </h2>
            </div>
           <h2 className="text-xl font-bold absolute top-12 right-12 text-gray-700"># {card.number}</h2>
           <img
            src={`https://img.pokemondb.net/artwork/${card.name.toLowerCase()}.jpg`}
            alt={card.name}
            className="h-48 w-48 mb-4 mx-auto"/>
          <div className="flex flex-row justify-center mb-4">
            <button
              type="button"
              className={`py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-3xl shadow-inner border border-transparent ${activeTab === 'about' ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-800 hover:bg-gray-200'} focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none`}
              onClick={() => handleTabClick('about')}>
              Base Stats
            </button>
            <button
              type="button"
              className={`py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-3xl shadow-inner border border-transparent ${activeTab === 'attacks' ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-800 hover:bg-gray-200'} focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none`}
              onClick={() => handleTabClick('attacks')}>
              About
            </button>
            <button
              type="button"
              className={`py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-3xl shadow-inner border border-transparent ${activeTab === 'abilities' ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-800 hover:bg-gray-200'} focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none`}
              onClick={() => handleTabClick('abilities')}>
              Attacks
            </button>
          </div>
          <div className="inline-flex items-center justify-center w-full mb-4">
            <hr className="w-80 h-px bg-gray-300 border-2 rounded-xl dark:bg-gray-700" />
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {activeTab === 'about' && (
              <div className={`flex-1 p-4 rounded-3xl shadow-lg ${typeColor}`}>
                <div className="flex flex-col ml-2 mr-2 space-y-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-gray-700 text-sm font-sans">
                      <strong>Level</strong>
                    </p>
                    <div className="bg-stone-100 h-2 rounded-full shadow-3xl">
                      <div
                        className={`${barColors} h-2 rounded-full`}
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
                        className={`${barColors} h-2 rounded-full`}
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
                            className={`${barColors} h-2 rounded-full`}
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
                                  className={`${barColors} h-2 rounded-full `}
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
                                  className={`${barColors} h-2 rounded-full`}
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
                    <div className="bg-stone-100 h-2 rounded-full shadow-xl">
                      <div
                        className={`${barColors} h-2 rounded-full shadow-xl`}
                        style={{ width: getBarWidth(card.set.total || 0, 150) }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
  
            {activeTab === 'attacks' && (
              <div className={`relative flex-1 p-6 rounded-3xl shadow-lg ${typeColor}`}>
                <img
                  src={`https://images.pokemontcg.io/${card.set.id}/symbol.png`}
                  alt="Symbol"
                  className="w-16 h-16 absolute top-4 right-4 shadow-3xl"/> 
                  <Link to={`https://prices.pokemontcg.io/cardmarket/${card.set.id}-${card.number}`} target="_blank" rel="noopener noreferrer">
                    <button type="button" className="w-12 h-8 absolute bottom-4 right-4 rounded-3xl shadow-lg bg-white font-bold text-black text-sm">
                      Shop
                    </button>
                  </Link>
                  <div className="ml-2 mr-16 text-sm font-sans mb-2">
                  <strong>{card.flavorText}</strong>
                </div>
                <div className="mt-2 ml-2 mb-2">
                  <div className="flex">
                    <div className="flex-1 text-gray-700 text-sm font-sans">
                        <strong>ID</strong>
                      <p>{card.id}</p>
                    </div>
                    <div className="flex-1 text-gray-700 text-sm font-sans">
                        <strong>Number</strong>
                      <p>{card.number}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-1 text-gray-700 text-sm font-sans">
                        <strong>Supertype</strong>                 
                      <p>{card.supertype}</p>
                    </div>
                    <div className="flex-1 text-gray-700 text-sm font-sans">                    
                        <strong>Level</strong>                    
                      <p>{card.level}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-1 text-gray-700 text-sm font-sans">                   
                        <strong>Artist</strong>                    
                      <p>{card.artist}</p>
                    </div>
                    <div className="flex-1 text-gray-700 text-sm font-sans">                    
                        <strong>Rarity</strong>              
                      <p>{card.rarity}</p>
                  </div>
                  </div>
                  <div className="flex">
                    <div className="flex-1 text-gray-700 text-sm font-sans">
                        <strong>Type</strong>
                      <p>{card.types.join(', ')}</p>
                    </div>
                    <div className="flex-1 text-gray-700 text-sm font-sans">                    
                        <strong>Subtype</strong>                   
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
                {card.attacks?.map((attacks, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="text-gray-700 text-sm font-bold">{attacks.name}</h3>
                    <p className="text-gray-700 text-sm">{attacks.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  useEffect(()=> {
    if(loading){
      document.body.style.overflow= 'hidden';
    } else{
      document.body.style.overflow='auto';
    }
    return()=>{
      document.body.style.overflow='auto';
    };

  }, [loading]);

  const fetchCards = () => {
    setLoading(true);
    console.log(`Fetching page ${currentPage}`);
    axios
      .get(`https://api.pokemontcg.io/v2/cards?page=${currentPage}&pageSize=${cardsPerPage}`)
      .then((response) => {
        if (response.data && response.data.data) {
          setCards((prevCards) => [...prevCards, ...response.data.data]);
          const totalPages = Math.ceil(response.data.total / cardsPerPage);
          setHasMore(currentPage < totalPages);
        } else {
          console.error('No data found in response:', response);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error while fetching data:', error);
        setHasMore(false);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCards();
  }, [currentPage]);

  const fetchMoreData = () => {
    console.log('Fetching more data...');
    setCurrentPage((prevPage) => prevPage + 1);
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  
const barColors ={
  Grass: 'bg-lime-800',
  Fire: 'bg-orange-900',
  Water: 'bg-sky-900',
  Lightning: 'bg-amber-900',
  Psychic: 'bg-amber-950',
  Fighting: 'bg-rose-900',
  Darkness: 'bg-slate-900',
  Metal: 'bg-gray-700',
  Fairy: 'bg-pink-800',
  Dragon: 'bg-red-950',
  Colorless: 'bg-violet-950'

};
const getBarColor =(type) =>{
  return barColors[type] || 'by-red-100';
};

  const typeColors = {
    Grass: 'bg-lime-50',
    Fire: 'bg-orange-100',
    Water: 'bg-sky-100',
    Lightning: 'bg-yellow-100/75',
    Psychic: 'bg-amber-100',
    Fighting: 'bg-rose-900/25',
    Darkness: 'bg-zinc-200',
    Metal: 'bg-gray-300',
    Fairy: 'bg-pink-100',
    Dragon: 'bg-rose-300/50',
    Colorless: 'bg-purple-100'
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
    <div className="w-full h-full overflow-auto">
      <div className="relative min-h-screen mb-20 ml-20 mr-20">
        <nav className="bg-gray-800 p-6 text-white h-24 shadow-2xl shadow-slate-500 flex items-center fixed top-0 left-0 right-0 z-50">
          <div className="flex items-center">
            <img
              src={poke}
              alt="Pokémon Icon"
              className="h-16 w-16 mr-4 mb-4 ml-4 mt-2"
            />
            <h1 className="text-3xl overflow-x font-bold ml-4 mb-6">Pokédex</h1>
          </div>
          <div className="flex-grow flex flex-shrink justify-center ml-12 mr-12 mt-2">
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
              className="p-2 border-2 rounded-3xl bg-gray-200 transition-transform duration-300 ease-in-out transform hover:scale-105 shadow-2xl shadow-gray-300"
            >
              <option className="text-gray-600" value="nameatoz">
                Sort by Name (A-Z)
              </option>
              <option className="text-gray-600" value="nameztoa">
                Sort by Name (Z-A)
              </option>
              <option className="text-gray-600" value="hphl">
                Sort by HP (High to Low)
              </option>
              <option className="text-gray-600" value="hplh">
                Sort by HP (Low to High)
              </option>
            </select>
          </div>
  
          <InfiniteScroll
            dataLength={cards.length}
            next={fetchMoreData}
            hasMore={true}
            style={{ overflow:'unset'}}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {loading ? (
                <div className="col-span-full flex justify-center items-center mt-48 ">
                  <div className="flex space-x-4">
                    <div className="h-10 w-10 bg-gray-700 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-10 w-10 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-10 w-10 bg-gray-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              ) : sortedCards.length > 0 ? (
                sortedCards.map((card, index) => (
                  <div
                    key={`${card.id}-${index}`} 
                    className="truncate ... border border-gray-200 p-4 rounded-3xl shadow-2xl shadow-gray-400 flex flex-col transition-transform duration-300 ease-in-out transform hover:scale-105"
                    onClick={() => handleClick(card)}>
                    <h2 className="text-2xl font-sans font-bold pb-2 text-sky-900">{card.name}</h2>
                    <img
                      src={`https://img.pokemondb.net/artwork/${card.name.toLowerCase()}.jpg`}
                      alt={card.name}
                      className="items-center object-contain h-48 w-48 rounded-3xl transition-transform duration-300 ease-in-out transform hover:scale-105 mb-2"
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}/>
                    <div className="object-scale-down-30">
                       <p className="text-sky-900 text-sm font-sans truncate ...">
                         <strong>HP</strong> {card.hp}
                       </p>
                    </div>
  
                    <div className="absolute bottom-2 right-2 text-gray-900 rounded-2xl w-12 h-8 flex items-center justify-center sm:mr-2 md:mr-2 sm:w-14 sm:h-6 md:w-16 md:h-8 lg:w-18 lg:h-8 xl:w-20 xl:h-8">
                      {card && card.types && card.types.length > 0 && (
                        <span
                          className={`${getTypeColor(card.types[0])} inline-block py-1 px-2 mx-1 rounded-2xl text-sm font-bold`}>
                          {card.types[0]}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex justify-center items-center mt-8">
                  <p>No cards found.</p>
                </div>
              )}
            </div>
          </InfiniteScroll>
        </div>
      </div>
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 bg-gray-500 text-white p-3 shadow-3xl w-12 h-12 rounded-full shadow-lg hover:scale-105"
        aria-label="Scroll to top">
        ↑
      </button>
      {modalOpen && selectedCard && (
        <Modal card={selectedCard} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;