export const WeddingDetails = ({ wedding, onUpdate }) => {
  return (
    <div className="section wedding-details">
      <h2>Wedding Details</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Groom's Name:</label>
          <input
            type="text"
            value={wedding.groomName}
            onChange={(e) => onUpdate({ ...wedding, groomName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Bride's Name:</label>
          <input
            type="text"
            value={wedding.brideName}
            onChange={(e) => onUpdate({ ...wedding, brideName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Wedding Date:</label>
          <input
            type="date"
            value={wedding.date}
            onChange={(e) => onUpdate({ ...wedding, date: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Overall Theme:</label>
          <input
            type="text"
            value={wedding.overallTheme}
            onChange={(e) => onUpdate({ ...wedding, overallTheme: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};