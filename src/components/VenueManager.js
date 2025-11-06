export const VenueManager = ({ venues, onUpdate }) => {
  const addVenue = () => {
    const newVenue = {
      name: '',
      location: '',
      contact: '',
      stage: false,
      catering: false
    };
    onUpdate([...venues, newVenue]);
  };

  const updateVenue = (index, updates) => {
    const updatedVenues = [...venues];
    updatedVenues[index] = { ...updatedVenues[index], ...updates };
    onUpdate(updatedVenues);
  };

  return (
    <div className="section venue-manager">
      <h2>Venues</h2>
      <button onClick={addVenue}>Add Venue</button>
      <div className="venues-grid">
        {venues.map((venue, index) => (
          <div key={index} className="venue-card">
            <input
              value={venue.name}
              onChange={(e) => updateVenue(index, { name: e.target.value })}
              placeholder="Venue Name"
            />
            <input
              value={venue.location}
              onChange={(e) => updateVenue(index, { location: e.target.value })}
              placeholder="Location"
            />
            <input
              value={venue.contact}
              onChange={(e) => updateVenue(index, { contact: e.target.value })}
              placeholder="Contact Number"
            />
            <div className="venue-features">
              <label>
                <input
                  type="checkbox"
                  checked={venue.stage}
                  onChange={(e) => updateVenue(index, { stage: e.target.checked })}
                />
                Stage Available
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={venue.catering}
                  onChange={(e) => updateVenue(index, { catering: e.target.checked })}
                />
                In-house Catering
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};