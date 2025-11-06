export const GuestList = ({ guests, onUpdate }) => {
  const [filter, setFilter] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');

  const filteredGuests = guests.filter(guest => {
    const matchesFilter = guest.name.toLowerCase().includes(filter.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || guest.group === selectedGroup;
    return matchesFilter && matchesGroup;
  });

  const groups = ['all', ...new Set(guests.map(guest => guest.group))];

  const addGuest = () => {
    const newGuest = {
      id: Math.max(...guests.map(g => g.id)) + 1,
      name: '',
      group: '',
      rsvp: 'pending',
      tag: '',
      events: [],
      dietary: '',
      accommodation: '',
      contact: '',
      notes: ''
    };
    onUpdate([...guests, newGuest]);
  };

  const updateGuest = (id, updates) => {
    onUpdate(guests.map(guest => 
      guest.id === id ? { ...guest, ...updates } : guest
    ));
  };

  return (
    <div className="section guest-list">
      <h2>Guest List</h2>
      <div className="controls">
        <input
          type="text"
          placeholder="Search guests..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
          {groups.map(group => (
            <option key={group} value={group}>
              {group.charAt(0).toUpperCase() + group.slice(1)}
            </option>
          ))}
        </select>
        <button onClick={addGuest}>Add Guest</button>
      </div>
      <div className="guests-grid">
        {filteredGuests.map(guest => (
          <div key={guest.id} className="guest-card">
            <input
              value={guest.name}
              onChange={(e) => updateGuest(guest.id, { name: e.target.value })}
              placeholder="Guest Name"
            />
            <select
              value={guest.rsvp}
              onChange={(e) => updateGuest(guest.id, { rsvp: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="declined">Declined</option>
            </select>
            <input
              value={guest.contact}
              onChange={(e) => updateGuest(guest.id, { contact: e.target.value })}
              placeholder="Contact"
            />
            <textarea
              value={guest.notes}
              onChange={(e) => updateGuest(guest.id, { notes: e.target.value })}
              placeholder="Notes"
            />
          </div>
        ))}
      </div>
    </div>
  );
};