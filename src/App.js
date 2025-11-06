import { Storage } from './utils/storage.js';
import { defaultData } from './utils/defaultData.js';
import { WeddingDetails } from './components/WeddingDetails.js';
import { GuestList } from './components/GuestList.js';
import { EventManager } from './components/EventManager.js';
import { VenueManager } from './components/VenueManager.js';
import { BudgetTracker } from './components/BudgetTracker.js';

const App = () => {
  const [weddingData, setWeddingData] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    // Load data from storage or use default
    const savedData = Storage.get('weddingData');
    if (savedData) {
      setWeddingData(JSON.parse(savedData));
    } else {
      setWeddingData(defaultData);
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (weddingData) {
      Storage.set('weddingData', JSON.stringify(weddingData));
    }
  }, [weddingData]);

  if (!weddingData) return <div>Loading...</div>;

  const updateWeddingData = (key, value) => {
    setWeddingData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="app">
      <h1>Indian Wedding Planner</h1>
      
      <nav className="tabs">
        <button 
          className={activeTab === 'details' ? 'active' : ''}
          onClick={() => setActiveTab('details')}
        >
          Wedding Details
        </button>
        <button 
          className={activeTab === 'guests' ? 'active' : ''}
          onClick={() => setActiveTab('guests')}
        >
          Guest List
        </button>
        <button 
          className={activeTab === 'events' ? 'active' : ''}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
        <button 
          className={activeTab === 'venues' ? 'active' : ''}
          onClick={() => setActiveTab('venues')}
        >
          Venues
        </button>
        <button 
          className={activeTab === 'budget' ? 'active' : ''}
          onClick={() => setActiveTab('budget')}
        >
          Budget
        </button>
      </nav>

      <main className="content">
        {activeTab === 'details' && (
          <WeddingDetails 
            wedding={weddingData.wedding}
            onUpdate={(wedding) => updateWeddingData('wedding', wedding)}
          />
        )}
        {activeTab === 'guests' && (
          <GuestList
            guests={weddingData.guests}
            onUpdate={(guests) => updateWeddingData('guests', guests)}
          />
        )}
        {activeTab === 'events' && (
          <EventManager
            events={weddingData.events}
            onUpdate={(events) => updateWeddingData('events', events)}
          />
        )}
        {activeTab === 'venues' && (
          <VenueManager
            venues={weddingData.venues}
            onUpdate={(venues) => updateWeddingData('venues', venues)}
          />
        )}
        {activeTab === 'budget' && (
          <BudgetTracker
            budget={weddingData.budget}
            onUpdate={(budget) => updateWeddingData('budget', budget)}
          />
        )}
      </main>
    </div>
  );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));