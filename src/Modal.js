import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const API_KEY = "633eb196-a28a-4265-acc0-378d1e382004";

function Modal() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); 
  const navigate = useNavigate(); 

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
  }, []);

  
  if (loading) return (
   <div className="col-span-full flex justify-center items-center mt-32">
     <div className="flex space-x-4">
       <div className="h-10 w-10 bg-gray-700 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-10 w-10 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-10 w-10 bg-gray-500 rounded-full animate-bounce"></div>
    </div>
    </div>);

  
  const card = cards.find(card => card.id === id);

  if (!card) return <p>Card not found</p>;

  return (
    <div className="bg-black bg-opacity-50 min-h-screen flex justify-center items-center">
    <div className="mt-20 mb-20">
      <div
        key={card.id}
        className="w-76 bg-amber-100 border border-gray-300 rounded-3xl shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform hover:scale-105"
        onClick={() => navigate(`/card/${card.id}`)}
      >
        <div className="p-2">
          <h2 className="text-2xl font-sans font-bold text-gray-700">{card.name}</h2>
          <p className="ml-2 text-gray-700 text-xl"><strong> #</strong> {card.number}</p>
        </div>

        <div className="flex justify-center mb-4">
          <img
            src={`https://img.pokemondb.net/artwork/${card.name.toLowerCase()}.jpg`}
            alt={card.name}
            className="object-contain h-36 w-48 rounded-3xl transition-transform duration-300 ease-in-out transform hover:scale-105"
            onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
          />
        </div>
        
        <div className="space-y-2 rounded-3xl bg-white">

          
          
          

          <p className="text-gray-700 text-sm flex justify-center"><strong> </strong> {card.attacks?.map(attack => attack.name).join(', ')}</p>

          <div className="flex justify-center space-x-6">
            <div className="bg-white rounded-3xl">
             <p className="ml-2 mr-2 text-gray-700 text-sm"><strong>Weaknesses </strong> {card.weaknesses?.map(weakness => weakness.type).join(', ')}</p>
            </div>

            <div className="bg-white rounded-3xl">
             <p className="ml-2 mr-2 text-gray-700 text-sm"><strong>Weakness Value </strong> {card.weaknesses?.map(weakness => weakness.value).join(', ')}</p>
            </div>
          </div>

          <div className="flex justify-center space-x-20 ml-2 mr-2">
          <div className="bg-white rounded-3xl ">
            <p className="ml-2 mr-2 text-gray-700 text-sm"><strong>Set </strong> {card.set.name}</p>
          </div>

          <div className="bg-white rounded-3xl">
           <p className="ml-2 mr-2 text-gray-700 text-sm"><strong>Supertype </strong> {card.supertype}</p>
          </div>
          </div>

          <div className="flex justify-center ml-2 mr-2 space-x-20">
            <div className="bg-white rounded-3xl">
             <p className="ml-2 mr-2 text-gray-700 text-sm"><strong>Rarity </strong> {card.rarity}</p>
            </div>
            <div className="bg-white rounded-3xl">
             <p className="ml-2 mr-2 text-gray-700 text-sm"><strong>Legalities </strong> {card.legalities.unlimited}</p>
            </div>
          </div>


          <p className="text-gray-700 text-sm ml-4"><strong> HP </strong> {card.hp}</p>
           <div className="ml-4 mr-4 bg-gray-200 rounded-full h-2.5 ">
            <div className="bg-amber-200 h-2.5 rounded-full" style={{ width: `${(card.hp)/2}%` }}></div>
           </div>
          
           <p className="text-gray-700 text-sm space-x-4 ml-4"><strong> Damage </strong> {card.attacks?.map(attack => attack.damage).join(', ')}</p>
           
           
           <div className="ml-4 mr-4 bg-gray-200 rounded-full h-2.5 ">
             <div className="bg-amber-200 h-2.5 rounded-full" style={{ width: `${Math.min(card.attacks?.reduce((sum, attack) => sum + parseInt(attack.damage, 10) || 0, 0), 100)}%` }}></div>
           </div>

          <div className="flex justify-center space-x-4 p-2">
          <p className="ml-2 text-gray-700 text-sm"><strong>Artist </strong> {card.artist}</p>
          <p className="mr-2 text-gray-700 text-sm"><strong>Release Date </strong> {card.set.releaseDate}</p>
         </div>
          

        </div>
        
        <div className="absolute top-2 right-2 text-gray-500 rounded-2xl w-12 h-8 flex items-center justify-center sm:w-14 sm:h-6 md:w-16 md:h-8 lg:w-18 lg:h-8 xl:w-20 xl:h-8">
          {card.types.map((type, index) => (
            <span
              key={index}
              className={`text-xs p-2 text-gray-900 drop-shadow-xl object-cover rounded-2xl font-bold ${getTypeColor(type)}`}
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
  
  );
}


function getTypeColor(type) {
  
  switch (type) {
    case 'Fire':
      return 'bg-red-500 text-white';
    case 'Water':
      return 'bg-blue-500 text-white';
    
    default:
      return 'bg-gray-500 text-white';
  }
}

export default Modal;
