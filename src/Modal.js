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

  
  if (loading) return <p>Loading...</p>;

  
  const card = cards.find(card => card.id === id);

  if (!card) return <p>Card not found</p>;

  return (
  <div className="bg">
    <div className="grid mt-20 ml-40 mr-40">
      <div
        key={card.id}
        className="truncate ... border border-gray-200 p-4 rounded-3xl shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform hover:scale-105"
        onClick={() => navigate(`/card/${card.id}`)}
      >
        <h2 className="text-2xl font-sans font-bold pb-2 text-sky-900">{card.name}</h2>
        <div className="">
         <img
          src={`https://img.pokemondb.net/artwork/${card.name.toLowerCase()}.jpg`}
          alt={card.name}
          className=" object-contain h-48 w-48 rounded-3xl transition-transform duration-300 ease-in-out transform hover:scale-105"
          onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
         />
        </div>
        
        <div className="object-scale-down-30">
          <p className="text-sky-900 text-sm font-sans truncate ..."><strong>HP</strong> {card.hp}</p>
          <p className="text-sky-900 text-sm font-sans truncate ..."><strong>Attacks </strong> {card.attacks?.map(attack => attack.name).join(', ')}</p>
          <p className="text-sky-900 text-sm font-sans truncate ..."><strong>Weaknesses </strong> {card.weaknesses?.map(weakness => weakness.type).join(', ')}</p>
          <p className="text-sky-900 text-sm font-sans truncate ..."><strong>Weakness Value </strong> {card.weaknesses?.map(weakness => weakness.value).join(', ')}</p>
          <p className="text-sky-900 text-sm font-sans truncate ..."><strong>Set </strong> {card.set.name}</p>
          <p className="text-sky-900 text-sm font-sans truncate ..."><strong>Supertype </strong> {card.supertype}</p>
          <p className="text-sky-900 text-sm font-sans truncate ..."><strong>Damage </strong> {card.attacks?.map(attack=>attack.damage).join(', ')}</p>
          <p className="text-sky-900 text-sm font-sans truncate ..."><strong>Retreat Cost </strong> {card.convertedRetreatCost}</p>
          <p className="text-sky-900 text-sm font-sans truncate ..."><strong>Rarity </strong>{card.rarity}</p>
          <p className="text-sky-900 text-sm font-sans truncate ..."><strong>Number </strong>{card.number}</p>
          <p className="text-sky-900 text-sm font-sans truncate ..."><strong>Total </strong>{card.set.total}</p>
          <p className="text-sky-900 text-sm font-sans truncate ..."><strong>Series </strong>{card.set.series}</p>
          <p className="text-sky-900 text-sm font-sans truncate ..."><strong>Release Date </strong>{card.set.releaseDate}</p>
          <p className="text-sky-900 text-sm font-sans truncate ..."><strong>Legalities </strong>{card.legalities.unlimited}</p>
          <p className="text-sky-900 text-sm font-sans truncate ..."><strong>Artist </strong>{card.artist}</p>
          
        </div>
        <div className="absolute bottom-2 right-2 text-gray-500 rounded-2xl w-12 h-8 flex items-center justify-center sm:w-14 sm:h-6 md:w-16 md:h-8 lg:w-18 lg:h-8 xl:w-20 xl:h-8">
          {card.types.map((type, index) => (
            <span
              key={index}
              className={`text-xs p-2 text-gray-900 drop-shadow-xl object cover rounded-2xl font-bold ${getTypeColor(type)}`}
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
