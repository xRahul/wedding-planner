export const EventManager = ({ events, onUpdate }) => {
  const addEvent = () => {
    const newEvent = {
      id: Math.max(...events.map(e => e.id)) + 1,
      name: '',
      date: '',
      time: '',
      venue: '',
      theme: '',
      dressCode: '',
      budget: 0,
      staff: [],
      checklist: [],
      notes: '',
      groomEntry: null,
      brideEntry: null,
      songs: []
    };
    onUpdate([...events, newEvent]);
  };

  const updateEvent = (id, updates) => {
    onUpdate(events.map(event => 
      event.id === id ? { ...event, ...updates } : event
    ));
  };

  const addChecklistItem = (eventId) => {
    const event = events.find(e => e.id === eventId);
    updateEvent(eventId, {
      checklist: [...event.checklist, '']
    });
  };

  return (
    <div className="section event-manager">
      <h2>Events</h2>
      <button onClick={addEvent}>Add New Event</button>
      <div className="events-grid">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <input
              value={event.name}
              onChange={(e) => updateEvent(event.id, { name: e.target.value })}
              placeholder="Event Name"
            />
            <div className="event-details">
              <input
                type="date"
                value={event.date}
                onChange={(e) => updateEvent(event.id, { date: e.target.value })}
              />
              <input
                type="time"
                value={event.time}
                onChange={(e) => updateEvent(event.id, { time: e.target.value })}
              />
            </div>
            <input
              value={event.venue}
              onChange={(e) => updateEvent(event.id, { venue: e.target.value })}
              placeholder="Venue"
            />
            <input
              value={event.theme}
              onChange={(e) => updateEvent(event.id, { theme: e.target.value })}
              placeholder="Theme"
            />
            <div className="checklist">
              <h4>Checklist</h4>
              {event.checklist.map((item, index) => (
                <input
                  key={index}
                  value={item}
                  onChange={(e) => {
                    const newChecklist = [...event.checklist];
                    newChecklist[index] = e.target.value;
                    updateEvent(event.id, { checklist: newChecklist });
                  }}
                />
              ))}
              <button onClick={() => addChecklistItem(event.id)}>Add Item</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};