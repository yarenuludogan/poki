
import React, {useState, useEffect} from 'react';
import axios from 'axios';

function App() {
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState('');
  
  
   useEffect(()=> {
    axios.get('https://api.pokemontcg.io/v2/cards').then(response=>{
      setCards(response.data.data);

    })
    .catch(error => {
      console.error('Error while fetching data:',error);

    });

   }, []);
   const filteredCards =cards.filter(card=> card.name.toLowerCase().includes(search.toLowerCase())
  
  );
  

  
  
  return (
    <div className="ml-12 mt-20 container mx-auto p-4 mr-12">
      <input
        type="text"
        placeholder="Search for a card"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 mt-12 p-2 ml-4  border-4 rounded-full w-full"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {filteredCards.map(card => (
          <div key={card.id} className="bg-slate-100 border items-center p-4 rounded-lg shadow-2xl">
            <img src={`https://img.pokemondb.net/artwork/${card.name.toLowerCase()}.jpg`}
                alt={card.name}
                className="w-full h-40 object-cover mb-2"
                onError={(e) => e.target.src = 'https://via.placeholder.com/150'} />
            <h2 className="text-xl font-bold">{card.name}</h2>
            <p className=""><strong>HP:</strong>{card.hp}</p>
            <p className=""><strong>Attacks:</strong>{card.attacks.map(attack=> attack.name).join(',')}</p>
            
            <p>{card.set.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
