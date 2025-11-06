/*
 * INDIAN WEDDING PLANNER - React Application
 * 
 * HOW TO DOWNLOAD AND USE:
 * 1. Save all three files (index.html, style.css, app.js) to a folder
 * 2. Open index.html in any modern web browser
 * 3. No server or installation required - runs entirely in browser
 * 
 * FEATURES:
 * - Complete wedding planning with 13+ modules
 * - Browser-based storage (persists in normal browser environment)
 * - Export entire plan as JSON file (backup)
 * - Import JSON file to restore data
 * - All fields are editable
 * - Works 100% offline after initial load
 * 
 * DATA PERSISTENCE:
 * - In regular browsers: Auto-saves to localStorage between sessions
 * - In sandboxed environments: Uses in-memory storage (export to save)
 * - Export JSON regularly as backup
 */

const { useState, useEffect } = React;

// Storage wrapper that works in both normal and sandboxed environments
const Storage = {
  memoryStore: {},
  get: function(key) {
    // Try localStorage first (works in regular browsers)
    try {
      const value = window.localStorage.getItem(key);
      if (value) return value;
    } catch (e) {
      // localStorage blocked in sandbox, use memory
    }
    return this.memoryStore[key];
  },
  set: function(key, value) {
    // Try localStorage first
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      // localStorage blocked, use memory instead
    }
    this.memoryStore[key] = value;
  },
  remove: function(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {}
    delete this.memoryStore[key];
  }
};
// Initial Default Data
const defaultData = {
  wedding: {
    groomName: "Groom Agarwal",
    brideName: "Bride Agarwal",
    groomFamily: "Agarwal",
    brideFamily: "Agarwal",
    date: "2025-11-30",
    overallTheme: "Traditional Gold",
    locations: ["Delhi", "Hanumangarh"],
  },
  guests: [
    { id: 1, name: "Raj Agarwal", group: "groom's family", rsvp: "confirmed", tag: "Family", events: ["Mehendi", "Sangeet", "Wedding Ceremony", "Reception"], dietary: "Vegetarian", accommodation: "The Lalit Delhi", contact: "9999000001", notes: "VIP guest" },
    { id: 2, name: "Sunita Agarwal", group: "bride's family", rsvp: "confirmed", tag: "Family", events: ["Mehendi", "Sangeet", "Haldi", "Wedding Ceremony", "Reception"], dietary: "Vegetarian", accommodation: "The Lalit Delhi", contact: "9999000002", notes: "" },
    { id: 3, name: "Anand Gupta", group: "Friend", rsvp: "pending", tag: "Friend", events: ["Sangeet", "Reception"], dietary: "Non-Veg", accommodation: "", contact: "9999000003", notes: "" },
    { id: 4, name: "Priya Jain", group: "Friend", rsvp: "confirmed", tag: "Friend", events: ["Sangeet", "Reception"], dietary: "Vegan", accommodation: "Hotel Radisson Hanumangarh", contact: "9999000004", notes: "" },
  ],
  events: [
    { id: 1, name: "Mehendi", date: "2025-11-27", time: "16:00", venue: "Community Hall", theme: "Bright Mehendi", dressCode: "Traditional Colorful", budget: 150000, staff: [], checklist: ["Setup mehndi stations", "Arrange seating", "Music setup"], notes: "Bride side event", groomEntry: null, brideEntry: null, songs: [] },
    { id: 2, name: "Sangeet", date: "2025-11-28", time: "18:00", venue: "Hotel Ballroom", theme: "Musical Night", dressCode: "Indo-Western Glam", budget: 250000, staff: [], checklist: ["Sound check", "Stage setup", "Lighting"], notes: "Both families", groomEntry: null, brideEntry: null, songs: [{id: 1, title: "Gal Ban Gayi", artist: "Neha Kakkar", duration: "3:30", performers: ["Priya Jain"], order: 1, practiced: false}] },
    { id: 3, name: "Haldi", date: "2025-11-29", time: "10:00", venue: "Home", theme: "Yellow Turmeric", dressCode: "Yellow Traditional", budget: 80000, staff: [], checklist: ["Prepare haldi paste", "Setup decoration"], notes: "Morning event", groomEntry: null, brideEntry: null, songs: [] },
    { id: 4, name: "Wedding Ceremony", date: "2025-11-30", time: "11:00", venue: "Main Venue", theme: "Royal Gold", dressCode: "Traditional Heavy", budget: 800000, staff: [], checklist: ["Mandap setup", "Priest arrival", "Photography"], notes: "Main ceremony", groomEntry: {time: "10:45", music: "Aaj Mere Yaar Ki Shaadi Hai", sequence: "Horse entry with band", costume: "Gold Sherwani"}, brideEntry: {time: "12:30", music: "Piya Aaye Na", sequence: "Under phoolon ki chadar", costume: "Red Lehenga"}, songs: [] },
    { id: 5, name: "Reception", date: "2025-11-30", time: "18:00", venue: "Banquet Hall", theme: "Elegant Evening", dressCode: "Western Formal", budget: 400000, staff: [], checklist: ["Red carpet setup", "Photo booth", "Cake arrangement"], notes: "Evening party", groomEntry: null, brideEntry: null, songs: [] },
  ],
  venues: [
    { name: "The Lalit Delhi", location: "Delhi", contact: "9999123456", stage: true, catering: true },
    { name: "Hotel Radisson Hanumangarh", location: "Hanumangarh", contact: "9999876543", stage: true, catering: true },
  ],
  budget: {
    total: 2000000,
    categories: [
      { name: "Venue", allocated: 600000, spent: 600000 },
      { name: "Catering", allocated: 400000, spent: 350000 },
      { name: "Decoration", allocated: 200000, spent: 180000 },
      { name: "Photography", allocated: 150000, spent: 120000 },
      { name: "Entertainment", allocated: 100000, spent: 80000 },
      { name: "Staff", allocated: 150000, spent: 100000 },
      { name: "Transportation", allocated: 100000, spent: 50000 },
      { name: "Gifts", allocated: 150000, spent: 100000 },
      { name: "Miscellaneous", allocated: 150000, spent: 50000 },
    ],
    expenses: [
      { id: 1, item: "Venue Booking", category: "Venue", amount: 600000, type: "Final Payment", date: "2025-10-15", vendor: "The Lalit Delhi", paid: true },
      { id: 2, item: "Photography", category: "Photography", amount: 120000, type: "Advance Payment", date: "2025-10-20", vendor: "Photographer", paid: true },
      { id: 3, item: "Decorations", category: "Decoration", amount: 180000, type: "Advance Payment", date: "2025-10-25", vendor: "Decorator", paid: false },
    ]
  },
  vendors: [
    { id: 1, name: "Decorator", type: "Decorator", contact: "9999000001", email: "decorator@example.com", rate: 180000, advancePaid: 50000, finalPaid: false, rating: 0, notes: "Specializes in floral" },
    { id: 2, name: "Caterer", type: "Caterer", contact: "9999000002", email: "caterer@example.com", rate: 350000, advancePaid: 100000, finalPaid: true, rating: 5, notes: "Excellent food quality" },
    { id: 3, name: "Photographer", type: "Photographer", contact: "9999000003", email: "photo@example.com", rate: 120000, advancePaid: 40000, finalPaid: false, rating: 4, notes: "Cinematic style" },
    { id: 4, name: "DJ", type: "DJ", contact: "9999000004", email: "dj@example.com", rate: 80000, advancePaid: 20000, finalPaid: false, rating: 0, notes: "" },
  ],
  tasks: [
    { name: "Book venue", assignee: "Raj Agarwal", deadline: "05-Nov-2025", done: false },
    { name: "Send invitations", assignee: "Priya Jain", deadline: "10-Nov-2025", done: false },
    { name: "Assign accommodation", assignee: "Anand Gupta", deadline: "15-Nov-2025", done: false },
    { name: "Book photographer", assignee: "Sunita Agarwal", deadline: "08-Nov-2025", done: false },
  ],
  shopping: [
    { item: "Lehenga", options: [{ vendor: "Jeweler", price: 90000 }, { vendor: "Caterer", price: 85000 }], shortlisted: false, delivered: false },
    { item: "Sherwani", options: [{ vendor: "Jeweler", price: 55000 }, { vendor: "Decorator", price: 50000 }], shortlisted: false, delivered: false },
  ],
  invitations: [
    { type: "Print", template: "Classic Red", guestsSent: [], guestsResponded: [] },
    { type: "E-Invite", template: "Floral", guestsSent: [], guestsResponded: [] }
  ],
  accommodation: [
    { hotel: "The Lalit Delhi", rooms: 25, guests: ["Raj Agarwal", "Priya Jain"] },
    { hotel: "Hotel Radisson Hanumangarh", rooms: 15, guests: ["Sunita Agarwal", "Anand Gupta"] },
  ],
  menu: [
    { id: 1, event: "Mehendi", mealType: "Dinner", items: [{name: "Paneer Tikka", type: "Vegetarian", spiceLevel: "Medium", quantity: 100, allergens: "Dairy"}, {name: "Chaat", type: "Vegetarian", spiceLevel: "Mild", quantity: 100, allergens: "Gluten"}], caterer: "Caterer", estimatedCost: 50000 },
    { id: 2, event: "Sangeet", mealType: "Dinner", items: [{name: "Butter Chicken", type: "Non-Veg", spiceLevel: "Medium", quantity: 80, allergens: "Dairy"}, {name: "Dal Makhani", type: "Vegetarian", spiceLevel: "Mild", quantity: 120, allergens: "Dairy"}], caterer: "Caterer", estimatedCost: 80000 },
    { id: 3, event: "Wedding Ceremony", mealType: "Lunch", items: [{name: "Paneer Butter Masala", type: "Vegetarian", spiceLevel: "Mild", quantity: 200, allergens: "Dairy"}, {name: "Naan", type: "Vegetarian", spiceLevel: "None", quantity: 300, allergens: "Gluten"}], caterer: "Caterer", estimatedCost: 120000 },
    { id: 4, event: "Reception", mealType: "Dinner", items: [{name: "Mix Grill", type: "Non-Veg", spiceLevel: "High", quantity: 100, allergens: "None"}, {name: "Veg Biryani", type: "Vegetarian", spiceLevel: "Medium", quantity: 150, allergens: "None"}], caterer: "Caterer", estimatedCost: 100000 },
  ],
  family: [
    { name: "Raj Agarwal", role: "Groom", relation: "Son", photo: "", group: "Agarwal" },
    { name: "Sunita Agarwal", role: "Bride", relation: "Daughter", photo: "", group: "Agarwal" },
  ],
  transport: [
    { id: 1, type: "Bus", details: "Delhi to Hanumangarh", group: "Groom's Side", date: "2025-11-27", time: "08:00", pickupLocation: "Delhi Central", dropLocation: "Hanumangarh", capacity: 50, booked: 35 },
    { id: 2, type: "Train", details: "Hanumangarh to Delhi", group: "Bride's Side", date: "2025-12-01", time: "14:00", pickupLocation: "Hanumangarh Station", dropLocation: "Delhi", capacity: 100, booked: 75 },
  ],
  staff: [
    { id: 1, name: "Rajesh Kumar", category: "Coordinator", contact: "9999100001", events: ["Mehendi", "Sangeet", "Wedding Ceremony"], shift: "Full Day", payment: 15000, paid: false, notes: "Main coordinator" },
    { id: 2, name: "Photo Team", category: "Photographer", contact: "9999100002", events: ["Wedding Ceremony", "Reception"], shift: "Event Hours", payment: 120000, paid: false, notes: "2 photographers, 1 videographer" },
    { id: 3, name: "DJ Amit", category: "DJ", contact: "9999100003", events: ["Sangeet", "Reception"], shift: "Evening", payment: 80000, paid: false, notes: "Bollywood specialist" },
  ],
  gifts: [
    { id: 1, type: "Gift Received", from: "Raj Agarwal", item: "Gold Chain", value: 50000, receivedDate: "2025-11-30", thankYouSent: false, notes: "" },
    { id: 2, type: "Return Gift", item: "Dry Fruit Box", quantity: 150, costPerUnit: 500, totalCost: 75000, ordered: true, delivered: false, notes: "Premium packaging" },
  ],
  returnMoney: [
    { id: 1, vendor: "Decorator", category: "Decoration", amountGiven: 180000, advance: 50000, finalPayment: 130000, balanceDue: 130000, dueDate: "2025-11-25", paid: false, paymentDate: null, notes: "Balance due before event" },
    { id: 2, vendor: "Caterer", category: "Catering", amountGiven: 350000, advance: 100000, finalPayment: 250000, balanceDue: 0, dueDate: "2025-11-30", paid: true, paymentDate: "2025-11-01", notes: "Fully paid" },
    { id: 3, vendor: "Photographer", category: "Photography", amountGiven: 120000, advance: 40000, finalPayment: 80000, balanceDue: 80000, dueDate: "2025-12-15", paid: false, paymentDate: null, notes: "Final payment after delivery" },
  ]
};

const MODULES = [
  "Wedding Details",
  "Guest Management",
  "Events Timeline",
  "Budget Tracking",
  "Food Menu Planning",
  "Staff Planning",
  "Gift Planning",
  "Function Return Money",
  "Guest Schedules",
  "Vendor Management",
  "Task Checklist",
  "Shopping",
  "Transportation"
];

function App() {
  const [activeModule, setActiveModule] = useState("Dashboard");
  const [data, setData] = useState(() => {
    // Load from storage on initial render
    try {
      const saved = Storage.get('wedding_planner_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    }
    return defaultData;
  });
  const [notification, setNotification] = useState("");

  // Auto-save to storage whenever data changes
  useEffect(() => {
    try {
      Storage.set('wedding_planner_data', JSON.stringify(data));
    } catch (err) {
      console.error('Error saving data:', err);
    }
  }, [data]);

  // Export to CSV helper
  function exportCSV(rows, columns, filename) {
    const csvContent =
      columns.join(",") +
      "\n" +
      rows.map(row => columns.map(col => JSON.stringify(row[col] || "")).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Export complete data as JSON
  function exportAllData() {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `wedding-plan-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setNotification('Data exported successfully!');
    setTimeout(() => setNotification(''), 2000);
  }

  // Import data from JSON file
  function importAllData(ev) {
    const file = ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (window.confirm('This will replace all current data. Continue?')) {
          setData(imported);
          setNotification('Data imported successfully!');
          setTimeout(() => setNotification(''), 2000);
        }
      } catch (err) {
        alert('Error importing data: ' + err.message);
      }
    };
    reader.readAsText(file);
    ev.target.value = ''; // Reset input
  }

  // Clear all data
  function clearAllData() {
    if (!window.confirm('⚠️ This will DELETE ALL wedding planning data. This cannot be undone. Are you sure?')) return;
    if (!window.confirm('Are you ABSOLUTELY sure? Export your data first if you want to keep it!')) return;
    try {
      Storage.remove('wedding_planner_data');
      setData(defaultData);
      setNotification('All data cleared!');
      setTimeout(() => setNotification(''), 2000);
    } catch (err) {
      alert('Error clearing data: ' + err.message);
    }
  }
  
  // Reset module (clear its data)
  function handleResetModule(module) {
    if (!window.confirm(`Reset all data for ${module}?`)) return;
    setData(prev => {
      const newData = { ...prev };
      switch (module) {
        case "Guest List":
          newData.guests = [];
          break;
        case "Budget and Expenses":
          newData.budget = { total: 0, expenses: [] };
          break;
        case "Venues":
          newData.venues = [];
          break;
        case "Events Schedule":
          newData.events = [];
          break;
        case "Vendor Management":
          newData.vendors = [];
          break;
        case "Task Checklist":
          newData.tasks = [];
          break;
        case "Shopping/Price Comparison":
          newData.shopping = [];
          break;
        case "Invitations":
          newData.invitations = [];
          break;
        case "Accommodation Logistics":
          newData.accommodation = [];
          break;
        case "Food Menu Planning":
          newData.menu = [];
          break;
        case "Family Tree":
          newData.family = [];
          break;
        case "Transportation Scheduling":
          newData.transport = [];
          break;
        default: break;
      }
      return newData;
    });
    setNotification(`${module} reset successfully.`);
    setTimeout(() => setNotification(""), 1200);
  }

  // Main App Layout
  return (
    React.createElement('div', { className: 'app-container' },
      React.createElement('header', { className: 'header' },
        React.createElement('div', { style: {display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'} },
          React.createElement('div', null,
            React.createElement('h1', null, 'Indian Wedding Planner'),
            React.createElement('p', null, `${data.wedding.groomName} & ${data.wedding.brideName} | ${data.wedding.date} | ${data.wedding.locations.join(', ')}`)
          ),
          React.createElement('div', { style: {display: 'flex', gap: '8px', alignItems: 'center'} },
            React.createElement('span', { style: {fontSize: '12px', color: 'var(--color-btn-primary-text)', opacity: 0.8} }, '💾 Auto-saved'),
            React.createElement('button', { 
              className: 'export-btn', 
              onClick: exportAllData,
              style: {background: 'var(--color-surface)', color: 'var(--color-primary)'}
            }, '⬇️ Export'),
            React.createElement('label', { 
              className: 'export-btn',
              style: {background: 'var(--color-surface)', color: 'var(--color-primary)', cursor: 'pointer', margin: 0}
            },
              '⬆️ Import',
              React.createElement('input', { type: 'file', accept: '.json', onChange: importAllData, style: {display: 'none'} })
            )
          )
        )
      ),
      notification && React.createElement('div', { className: 'status-success', style: {margin: 12} }, notification),
      React.createElement('div', { className: 'dashboard' },
        React.createElement('nav', { className: 'module-nav' },
          [React.createElement('button', {
            key: 'dashboard',
            className: `module-btn${activeModule === 'Dashboard' ? ' active' : ''}`,
            onClick: () => setActiveModule('Dashboard')
          }, 'Dashboard'),
          ...MODULES.map(module => (
            React.createElement('button', {
              key: module,
              className: `module-btn${activeModule === module ? ' active' : ''}`,
              onClick: () => setActiveModule(module)
            }, module)
          ))]
        ),
        React.createElement('main', { className: 'main' },
          activeModule === 'Dashboard'
            ? React.createElement(Dashboard, { data, setActiveModule, exportAllData, importAllData })
            : React.createElement(ModuleView, {
                module: activeModule,
                data,
                setData,
                exportCSV,
                handleResetModule,
                exportAllData,
                importAllData,
              })
        )
      ),
      React.createElement('footer', { className: 'footer' },
        React.createElement('div', { style: {display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'} },
          React.createElement('span', null,
            '© 2025 Indian Wedding Planner | ',
            '💾 All data saved to browser localStorage'
          ),
          React.createElement('button', {
            onClick: clearAllData,
            style: {
              padding: '6px 12px',
              fontSize: '12px',
              background: 'var(--color-error)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }
          }, '🗑️ Clear All Data')
        )
      )
    )
  );
}

function Dashboard({ data, setActiveModule, exportAllData, importAllData }) {
  const totalGuests = data.guests.length;
  const confirmedGuests = data.guests.filter(g => g.rsvp === 'confirmed').length;
  const totalBudget = data.budget.total;
  const totalSpent = data.budget.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const upcomingEvents = data.events.filter(e => new Date(e.date) >= new Date()).length;
  const pendingTasks = data.tasks.filter(t => !t.done).length;
  
  return React.createElement('div', { className: 'section' },
    React.createElement('h2', { className: 'section-title' }, '💐 Wedding Dashboard'),
    React.createElement('div', { style: {marginBottom: '24px', padding: '16px', background: 'var(--color-bg-1)', borderRadius: '8px'} },
      React.createElement('h3', { style: {marginBottom: '12px'} }, 'Data Management'),
      React.createElement('button', { className: 'export-btn', onClick: exportAllData }, '⬇️ Export Complete Wedding Plan (JSON)'),
      React.createElement('label', { className: 'export-btn', style: {cursor: 'pointer', display: 'inline-block'} },
        '⬆️ Import Wedding Plan (JSON)',
        React.createElement('input', { type: 'file', accept: '.json', onChange: importAllData, style: {display: 'none'} })
      ),
      React.createElement('p', { style: {marginTop: '12px', fontSize: '12px', color: 'var(--color-text-secondary)'} }, '💾 All changes are automatically saved to your browser')
    ),
    React.createElement('div', { className: 'dashboard-summary' },
      React.createElement('div', { className: 'summary-card' },
        React.createElement('h3', null, data.wedding.groomName + ' & ' + data.wedding.brideName),
        React.createElement('p', null, `📅 ${data.wedding.date}`),
        React.createElement('p', null, `🎨 Theme: ${data.wedding.overallTheme}`),
        React.createElement('p', null, `📍 ${data.wedding.locations.join(', ')}`)
      ),
      React.createElement('div', { className: 'summary-card' },
        React.createElement('h3', null, '👥 Guests'),
        React.createElement('p', null, `Total: ${totalGuests}`),
        React.createElement('p', null, `Confirmed: ${confirmedGuests}`),
        React.createElement('p', null, `Pending: ${totalGuests - confirmedGuests}`)
      ),
      React.createElement('div', { className: 'summary-card' },
        React.createElement('h3', null, '💰 Budget'),
        React.createElement('p', null, `Total: ₹${(totalBudget/1000).toFixed(0)}K`),
        React.createElement('p', null, `Spent: ₹${(totalSpent/1000).toFixed(0)}K`),
        React.createElement('p', null, `Remaining: ₹${((totalBudget-totalSpent)/1000).toFixed(0)}K`)
      ),
      React.createElement('div', { className: 'summary-card' },
        React.createElement('h3', null, '📋 Tasks'),
        React.createElement('p', null, `Events: ${upcomingEvents}`),
        React.createElement('p', null, `Pending Tasks: ${pendingTasks}`),
        React.createElement('p', null, `Staff: ${data.staff.length}`)
      )
    ),
    React.createElement('h3', { style: {marginTop: '24px', marginBottom: '16px'} }, 'Quick Access'),
    React.createElement('div', { className: 'dashboard-modules' },
      MODULES.map(module => (
        React.createElement('button', {
          key: module,
          className: 'module-btn',
          onClick: () => setActiveModule(module)
        }, module)
      ))
    )
  );
}

function ModuleView({ module, data, setData, exportCSV, handleResetModule, exportAllData, importAllData }) {
  
  switch(module) {
    case "Wedding Details": return React.createElement(WeddingDetails, { wedding: data.wedding, setData, exportAllData, importAllData });
    case "Guest Management": return React.createElement(GuestManagement, { guests: data.guests, events: data.events, setData, exportCSV, handleResetModule });
    case "Events Timeline": return React.createElement(EventsTimeline, { events: data.events, setData, exportCSV, handleResetModule });
    case "Budget Tracking": return React.createElement(BudgetTracking, { budget: data.budget, setData, exportCSV, handleResetModule });
    case "Food Menu Planning": return React.createElement(FoodMenuPlanning, { menu: data.menu, events: data.events, setData, exportCSV, handleResetModule });
    case "Staff Planning": return React.createElement(StaffPlanning, { staff: data.staff, events: data.events, setData, exportCSV, handleResetModule });
    case "Gift Planning": return React.createElement(GiftPlanning, { gifts: data.gifts, setData, exportCSV, handleResetModule });
    case "Function Return Money": return React.createElement(FunctionReturnMoney, { returnMoney: data.returnMoney, setData, exportCSV, handleResetModule });
    case "Guest Schedules": return React.createElement(GuestSchedules, { guests: data.guests, events: data.events, setData });
    case "Vendor Management": return React.createElement(VendorManagement, { vendors: data.vendors, setData, exportCSV, handleResetModule });
    case "Task Checklist": return React.createElement(TasksChecklist, { tasks: data.tasks, guests: data.guests, setData, exportCSV, handleResetModule });
    case "Shopping": return React.createElement(Shopping, { shopping: data.shopping, vendors: data.vendors, setData, exportCSV, handleResetModule });
    case "Transportation": return React.createElement(Transportation, { transport: data.transport, guests: data.guests, setData, exportCSV, handleResetModule });
    default: return React.createElement('div', null, 'Module not found.');
  }
}

// --- Begin Module Components --- //

function WeddingDetails({ wedding, setData, exportAllData, importAllData }) {
  const updateField = (field, value) => {
    setData(prev => ({
      ...prev,
      wedding: {
        ...prev.wedding,
        [field]: value
      }
    }));
  };
  
  const updateLocations = (value) => {
    setData(prev => ({
      ...prev,
      wedding: {
        ...prev.wedding,
        locations: value.split(',').map(l => l.trim()).filter(l => l)
      }
    }));
  };
  
  return React.createElement('div', { className: 'section' },
    React.createElement('h2', { className: 'section-title' }, '💍 Wedding Details'),
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', null, 'Groom Name:'),
      React.createElement('input', { type: 'text', value: wedding.groomName, onChange: e => updateField('groomName', e.target.value), style: {width: '100%', marginBottom: '12px'} })
    ),
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', null, 'Bride Name:'),
      React.createElement('input', { type: 'text', value: wedding.brideName, onChange: e => updateField('brideName', e.target.value), style: {width: '100%', marginBottom: '12px'} })
    ),
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', null, 'Groom Family:'),
      React.createElement('input', { type: 'text', value: wedding.groomFamily, onChange: e => updateField('groomFamily', e.target.value), style: {width: '100%', marginBottom: '12px'} })
    ),
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', null, 'Bride Family:'),
      React.createElement('input', { type: 'text', value: wedding.brideFamily, onChange: e => updateField('brideFamily', e.target.value), style: {width: '100%', marginBottom: '12px'} })
    ),
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', null, 'Wedding Date:'),
      React.createElement('input', { type: 'date', value: wedding.date, onChange: e => updateField('date', e.target.value), style: {width: '100%', marginBottom: '12px'} })
    ),
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', null, 'Overall Theme:'),
      React.createElement('input', { type: 'text', value: wedding.overallTheme, onChange: e => updateField('overallTheme', e.target.value), style: {width: '100%', marginBottom: '12px'} })
    ),
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', null, 'Locations (comma-separated):'),
      React.createElement('input', { type: 'text', value: wedding.locations.join(', '), onChange: e => updateLocations(e.target.value), style: {width: '100%', marginBottom: '12px'} })
    ),
    React.createElement('hr', { style: {margin: '24px 0'} }),
    React.createElement('h3', null, 'Import/Export Full Wedding Plan'),
    React.createElement('p', { style: {fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '12px'} }, '💾 Changes are auto-saved to browser storage'),
    React.createElement('button', { className: 'export-btn', onClick: exportAllData }, '⬇️ Export Complete Plan (JSON)'),
    React.createElement('label', { className: 'export-btn', style: {cursor: 'pointer', display: 'inline-block'} },
      '⬆️ Import Plan (JSON)',
      React.createElement('input', { type: 'file', accept: '.json', onChange: importAllData, style: {display: 'none'} })
    )
  );
}

function GuestManagement({ guests, events, setData, exportCSV, handleResetModule }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [tag, setTag] = useState("");
  const [contact, setContact] = useState("");
  const [dietary, setDietary] = useState("Vegetarian");
  const [selectedEvents, setSelectedEvents] = useState([]);

  function addGuest() {
    if (!name) return;
    const newId = Math.max(0, ...guests.map(g => g.id)) + 1;
    setData(prev => ({ ...prev, guests: [...prev.guests, { id: newId, name, group, tag, rsvp: 'pending', events: selectedEvents, dietary, contact, accommodation: '', notes: '' }] }));
    setName(''); setGroup(''); setTag(''); setContact(''); setDietary('Vegetarian'); setSelectedEvents([]);
    setShowAddForm(false);
  }

  function importCSV(ev) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const lines = e.target.result.split("\n").filter(Boolean);
      const imported = lines.map(line => {
        const [name, group, tag] = line.split(",");
        return { name: name.trim(), group: group.trim(), rsvp: false, tag: tag.trim() };
      });
      setData(prev => ({ ...prev, guests: [...prev.guests, ...imported] }));
    };
    reader.readAsText(ev.target.files[0]);
  }

  function exportList() {
    exportCSV(guests, ["name","group","rsvp","tag"], "guests.csv");
  }

  function updateGuest(id, field, value) {
    setData(prev => ({
      ...prev,
      guests: prev.guests.map(g => g.id === id ? {...g, [field]: value} : g)
    }));
  }
  
  function deleteGuest(id) {
    if (!confirm('Delete this guest?')) return;
    setData(prev => ({ ...prev, guests: prev.guests.filter(g => g.id !== id) }));
  }

  const toggleEventForGuest = (guestId, eventName) => {
    setData(prev => ({
      ...prev,
      guests: prev.guests.map(g => {
        if (g.id === guestId) {
          const events = g.events.includes(eventName) 
            ? g.events.filter(e => e !== eventName)
            : [...g.events, eventName];
          return {...g, events};
        }
        return g;
      })
    }));
  };
  
  return React.createElement('div', { className: 'section' },
    React.createElement('h2', { className: 'section-title' }, '👥 Guest Management'),
    React.createElement('div', { style: {marginBottom: '16px'} },
      React.createElement('button', { className: 'export-btn', onClick: () => setShowAddForm(!showAddForm) }, showAddForm ? 'Cancel' : '+ Add Guest'),
      React.createElement('button', { className: 'export-btn', onClick: () => exportCSV(guests, ['name','group','tag','rsvp','contact','dietary'], 'guests.csv') }, 'Export CSV'),
      React.createElement('button', { className: 'reset-btn', onClick: () => handleResetModule('Guest Management') }, 'Reset')
    ),
    showAddForm && React.createElement('div', { style: {background: 'var(--color-bg-1)', padding: '16px', borderRadius: '8px', marginBottom: '16px'} },
      React.createElement('h3', null, 'Add New Guest'),
      React.createElement('input', { type: 'text', value: name, onChange: e => setName(e.target.value), placeholder: 'Guest name', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('input', { type: 'text', value: group, onChange: e => setGroup(e.target.value), placeholder: 'Group (e.g., Groom\'s family)', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('input', { type: 'text', value: tag, onChange: e => setTag(e.target.value), placeholder: 'Tag (Family/Friend)', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('input', { type: 'text', value: contact, onChange: e => setContact(e.target.value), placeholder: 'Contact number', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('select', { value: dietary, onChange: e => setDietary(e.target.value), style: {width: '100%', marginBottom: '8px'} },
        React.createElement('option', { value: 'Vegetarian' }, 'Vegetarian'),
        React.createElement('option', { value: 'Vegan' }, 'Vegan'),
        React.createElement('option', { value: 'Non-Veg' }, 'Non-Veg'),
        React.createElement('option', { value: 'Gluten-Free' }, 'Gluten-Free')
      ),
      React.createElement('label', null, 'Events:'),
      events.map(ev => React.createElement('label', { key: ev.name, style: {display: 'block', marginBottom: '4px'} },
        React.createElement('input', { type: 'checkbox', checked: selectedEvents.includes(ev.name), onChange: e => {
          if (e.target.checked) setSelectedEvents([...selectedEvents, ev.name]);
          else setSelectedEvents(selectedEvents.filter(n => n !== ev.name));
        } }),
        ' ' + ev.name
      )),
      React.createElement('button', { className: 'export-btn', onClick: addGuest, style: {marginTop: '12px'} }, 'Add Guest')
    ),
    React.createElement('p', null, `Total Guests: ${guests.length} | Confirmed: ${guests.filter(g => g.rsvp === 'confirmed').length}`),
    React.createElement('div', { style: {overflowX: 'auto'} },
      React.createElement('table', null,
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', null, 'Name'),
            React.createElement('th', null, 'Group'),
            React.createElement('th', null, 'RSVP'),
            React.createElement('th', null, 'Dietary'),
            React.createElement('th', null, 'Events'),
            React.createElement('th', null, 'Contact'),
            React.createElement('th', null, 'Actions')
          )
        ),
        React.createElement('tbody', null,
          guests.map(guest => React.createElement('tr', { key: guest.id },
            React.createElement('td', null,
              React.createElement('input', { type: 'text', value: guest.name, onChange: e => updateGuest(guest.id, 'name', e.target.value), style: {width: '100%', padding: '4px', border: '1px solid transparent'} })
            ),
            React.createElement('td', null,
              React.createElement('input', { type: 'text', value: guest.group, onChange: e => updateGuest(guest.id, 'group', e.target.value), style: {width: '100%', padding: '4px', border: '1px solid transparent'} })
            ),
            React.createElement('td', null,
              React.createElement('select', { value: guest.rsvp, onChange: e => updateGuest(guest.id, 'rsvp', e.target.value), style: {padding: '4px', width: '100%'} },
                React.createElement('option', { value: 'pending' }, 'Pending'),
                React.createElement('option', { value: 'confirmed' }, 'Confirmed'),
                React.createElement('option', { value: 'declined' }, 'Declined')
              )
            ),
            React.createElement('td', null,
              React.createElement('select', { value: guest.dietary, onChange: e => updateGuest(guest.id, 'dietary', e.target.value), style: {padding: '4px', width: '100%'} },
                React.createElement('option', { value: 'Vegetarian' }, 'Vegetarian'),
                React.createElement('option', { value: 'Vegan' }, 'Vegan'),
                React.createElement('option', { value: 'Non-Veg' }, 'Non-Veg'),
                React.createElement('option', { value: 'Gluten-Free' }, 'Gluten-Free')
              )
            ),
            React.createElement('td', null, guest.events.length + ' events'),
            React.createElement('td', null,
              React.createElement('input', { type: 'text', value: guest.contact, onChange: e => updateGuest(guest.id, 'contact', e.target.value), style: {width: '100%', padding: '4px', border: '1px solid transparent'} })
            ),
            React.createElement('td', null,
              React.createElement('button', { onClick: () => deleteGuest(guest.id), style: {padding: '4px 8px', fontSize: '12px', background: 'var(--color-error)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'} }, 'Delete')
            )
          ))
        )
      )
    )
  );
}

function BudgetTracking({ budget, setData, exportCSV, handleResetModule }) {
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("Venue");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Advance Payment");
  const [vendor, setVendor] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryBudget, setNewCategoryBudget] = useState("");

  function addExpense() {
    if (!item || !amount) return;
    const newId = Math.max(0, ...budget.expenses.map(e => e.id)) + 1;
    const today = new Date().toISOString().split('T')[0];
    setData(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        expenses: [...prev.budget.expenses, { id: newId, item, category, amount: parseFloat(amount), type, vendor, date: today, paid: false }]
      }
    }));
    setItem(""); setAmount(""); setVendor("");
  }

  const addCategory = () => {
    if (!newCategoryName) return;
    setData(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        categories: [...prev.budget.categories, { name: newCategoryName, allocated: parseInt(newCategoryBudget) || 0, spent: 0 }]
      }
    }));
    setNewCategoryName(''); setNewCategoryBudget(''); setShowAddCategory(false);
  };
  
  const updateCategoryBudget = (catName, newBudget) => {
    setData(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        categories: prev.budget.categories.map(c => c.name === catName ? {...c, allocated: parseInt(newBudget) || 0} : c)
      }
    }));
  };
  
  const deleteExpense = (id) => {
    if (!confirm('Delete this expense?')) return;
    setData(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        expenses: prev.budget.expenses.filter(e => e.id !== id)
      }
    }));
  };
  
  const totalSpent = budget.expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const remaining = budget.total - totalSpent;
  const categoryTotals = {};
  budget.categories.forEach(cat => {
    const spent = budget.expenses.filter(e => e.category === cat.name).reduce((sum, e) => sum + e.amount, 0);
    categoryTotals[cat.name] = { allocated: cat.allocated, spent };
  });

  return React.createElement('div', { className: 'section' },
    React.createElement('h2', { className: 'section-title' }, '💰 Budget Tracking'),
    React.createElement('div', { style: {display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px'} },
      React.createElement('div', { className: 'summary-card' },
        React.createElement('h3', null, 'Total Budget'),
        React.createElement('p', { style: {fontSize: '24px', fontWeight: 'bold'} }, `₹${(budget.total/1000).toFixed(0)}K`)
      ),
      React.createElement('div', { className: 'summary-card' },
        React.createElement('h3', null, 'Total Spent'),
        React.createElement('p', { style: {fontSize: '24px', fontWeight: 'bold', color: 'var(--color-warning)'} }, `₹${(totalSpent/1000).toFixed(0)}K`)
      ),
      React.createElement('div', { className: 'summary-card' },
        React.createElement('h3', null, 'Remaining'),
        React.createElement('p', { style: {fontSize: '24px', fontWeight: 'bold', color: 'var(--color-success)'} }, `₹${(remaining/1000).toFixed(0)}K`)
      )
    ),
    React.createElement('h3', null, 'Category-wise Breakdown'),
    React.createElement('button', { className: 'export-btn', onClick: () => setShowAddCategory(!showAddCategory), style: {fontSize: '13px', padding: '6px 12px', marginBottom: '12px'} }, showAddCategory ? 'Cancel' : '+ Add Category'),
    showAddCategory && React.createElement('div', { style: {background: 'var(--color-bg-3)', padding: '12px', borderRadius: '8px', marginBottom: '12px'} },
      React.createElement('input', { type: 'text', value: newCategoryName, onChange: e => setNewCategoryName(e.target.value), placeholder: 'Category name', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('input', { type: 'number', value: newCategoryBudget, onChange: e => setNewCategoryBudget(e.target.value), placeholder: 'Allocated budget', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('button', { className: 'export-btn', onClick: addCategory }, 'Add Category')
    ),
    React.createElement('table', { style: {marginBottom: '24px'} },
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', null, 'Category'),
          React.createElement('th', null, 'Allocated'),
          React.createElement('th', null, 'Spent'),
          React.createElement('th', null, 'Remaining'),
          React.createElement('th', null, '%')
        )
      ),
      React.createElement('tbody', null,
        Object.keys(categoryTotals).map(catName => {
          const cat = categoryTotals[catName];
          const percent = cat.allocated > 0 ? ((cat.spent / cat.allocated) * 100).toFixed(0) : 0;
          return React.createElement('tr', { key: catName },
            React.createElement('td', null, catName),
            React.createElement('td', null,
              React.createElement('input', { type: 'number', value: cat.allocated, onChange: e => updateCategoryBudget(catName, e.target.value), style: {width: '80px', padding: '4px'} })
            ),
            React.createElement('td', null, `₹${(cat.spent/1000).toFixed(0)}K`),
            React.createElement('td', null, `₹${((cat.allocated - cat.spent)/1000).toFixed(0)}K`),
            React.createElement('td', null, `${percent}%`)
          );
        })
      )
    ),
    React.createElement('h3', null, 'Add Expense'),
    React.createElement('div', { style: {background: 'var(--color-bg-2)', padding: '16px', borderRadius: '8px', marginBottom: '16px'} },
      React.createElement('input', { type: 'text', value: item, onChange: e => setItem(e.target.value), placeholder: 'Expense item', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('select', { value: category, onChange: e => setCategory(e.target.value), style: {width: '100%', marginBottom: '8px'} },
        budget.categories.map(cat => React.createElement('option', { key: cat.name, value: cat.name }, cat.name))
      ),
      React.createElement('input', { type: 'number', value: amount, onChange: e => setAmount(e.target.value), placeholder: 'Amount', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('select', { value: type, onChange: e => setType(e.target.value), style: {width: '100%', marginBottom: '8px'} },
        React.createElement('option', null, 'Advance Payment'),
        React.createElement('option', null, 'Final Payment'),
        React.createElement('option', null, 'Additional Charges')
      ),
      React.createElement('input', { type: 'text', value: vendor, onChange: e => setVendor(e.target.value), placeholder: 'Vendor name', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('button', { className: 'export-btn', onClick: addExpense }, 'Add Expense')
    ),
    React.createElement('button', { className: 'export-btn', onClick: () => exportCSV(budget.expenses, ['item','category','amount','type','vendor','date'], 'expenses.csv') }, 'Export CSV'),
    React.createElement('button', { className: 'reset-btn', onClick: () => handleResetModule('Budget Tracking') }, 'Reset'),
    React.createElement('h3', { style: {marginTop: '24px'} }, 'All Expenses'),
    React.createElement('div', { style: {overflowX: 'auto'} },
      React.createElement('table', null,
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', null, 'Item'),
            React.createElement('th', null, 'Category'),
            React.createElement('th', null, 'Amount'),
            React.createElement('th', null, 'Type'),
            React.createElement('th', null, 'Vendor'),
            React.createElement('th', null, 'Date'),
            React.createElement('th', null, 'Status'),
            React.createElement('th', null, 'Actions')
          )
        ),
        React.createElement('tbody', null,
          budget.expenses.map(exp => React.createElement('tr', { key: exp.id },
            React.createElement('td', null, exp.item),
            React.createElement('td', null, exp.category),
            React.createElement('td', null, `₹${exp.amount.toLocaleString()}`),
            React.createElement('td', null, exp.type),
            React.createElement('td', null, exp.vendor),
            React.createElement('td', null, exp.date),
            React.createElement('td', null, exp.paid ? '✅ Paid' : '⏳ Pending'),
            React.createElement('td', null,
              React.createElement('button', { onClick: () => deleteExpense(exp.id), style: {padding: '4px 8px', fontSize: '12px', background: 'var(--color-error)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'} }, 'Delete')
            )
          ))
        )
      )
    )
  );
}

function EventsTimeline({ events, setData, exportCSV, handleResetModule }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddSong, setShowAddSong] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [songDuration, setSongDuration] = useState('');
  const [songPerformers, setSongPerformers] = useState('');
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventVenue, setNewEventVenue] = useState('');
  const [newEventTheme, setNewEventTheme] = useState('');
  const [newEventBudget, setNewEventBudget] = useState('');
  
  const addSongToEvent = () => {
    if (!selectedEvent || !songTitle) return;
    const newSongId = selectedEvent.songs.length > 0 ? Math.max(...selectedEvent.songs.map(s => s.id)) + 1 : 1;
    const newSong = {
      id: newSongId,
      title: songTitle,
      artist: songArtist,
      duration: songDuration,
      performers: songPerformers.split(',').map(p => p.trim()),
      order: selectedEvent.songs.length + 1,
      practiced: false
    };
    setData(prev => ({
      ...prev,
      events: prev.events.map(e => e.id === selectedEvent.id ? {...e, songs: [...e.songs, newSong]} : e)
    }));
    setSongTitle(''); setSongArtist(''); setSongDuration(''); setSongPerformers('');
    setShowAddSong(false);
  };
  
  const updateEvent = (id, field, value) => {
    setData(prev => ({
      ...prev,
      events: prev.events.map(e => e.id === id ? {...e, [field]: value} : e)
    }));
  };
  
  const addEvent = () => {
    if (!newEventName || !newEventDate) {
      alert('Event name and date are required');
      return;
    }
    const newId = Math.max(0, ...events.map(e => e.id)) + 1;
    setData(prev => ({
      ...prev,
      events: [...prev.events, {
        id: newId,
        name: newEventName,
        date: newEventDate,
        time: newEventTime || '12:00',
        venue: newEventVenue || 'TBD',
        theme: newEventTheme || 'Traditional',
        dressCode: 'Formal',
        budget: parseInt(newEventBudget) || 0,
        staff: [],
        checklist: [],
        notes: '',
        groomEntry: null,
        brideEntry: null,
        songs: []
      }]
    }));
    setNewEventName(''); setNewEventDate(''); setNewEventTime(''); setNewEventVenue(''); setNewEventTheme(''); setNewEventBudget('');
    setShowAddEvent(false);
  };
  
  const deleteEvent = (id) => {
    if (!confirm('Delete this event?')) return;
    setData(prev => ({
      ...prev,
      events: prev.events.filter(e => e.id !== id)
    }));
  };
  
  return React.createElement('div', { className: 'section' },
    React.createElement('h2', { className: 'section-title' }, '📋 Events Timeline'),
    React.createElement('button', { className: 'export-btn', onClick: () => setShowAddEvent(!showAddEvent) }, showAddEvent ? 'Cancel' : '+ Add Event'),
    React.createElement('button', { className: 'export-btn', onClick: () => exportCSV(events, ['name','date','time','venue','theme','budget'], 'events.csv') }, 'Export CSV'),
    showAddEvent && React.createElement('div', { style: {background: 'var(--color-bg-2)', padding: '16px', borderRadius: '8px', marginTop: '16px', marginBottom: '16px'} },
      React.createElement('h3', null, 'Add New Event'),
      React.createElement('input', { type: 'text', value: newEventName, onChange: e => setNewEventName(e.target.value), placeholder: 'Event name', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('input', { type: 'date', value: newEventDate, onChange: e => setNewEventDate(e.target.value), placeholder: 'Date', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('input', { type: 'time', value: newEventTime, onChange: e => setNewEventTime(e.target.value), placeholder: 'Time', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('input', { type: 'text', value: newEventVenue, onChange: e => setNewEventVenue(e.target.value), placeholder: 'Venue', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('input', { type: 'text', value: newEventTheme, onChange: e => setNewEventTheme(e.target.value), placeholder: 'Theme', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('input', { type: 'number', value: newEventBudget, onChange: e => setNewEventBudget(e.target.value), placeholder: 'Budget', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('button', { className: 'export-btn', onClick: addEvent }, 'Create Event')
    ),
    React.createElement('div', { style: {marginTop: '16px'} },
      events.sort((a,b) => new Date(a.date) - new Date(b.date)).map(event => React.createElement('div', { key: event.id, style: {background: 'var(--color-bg-1)', padding: '16px', borderRadius: '12px', marginBottom: '16px', border: '1px solid var(--color-border)'} },
        React.createElement('div', { style: {display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px'} },
          React.createElement('h3', null, event.name),
          React.createElement('div', { style: {display: 'flex', gap: '8px'} },
            React.createElement('button', { className: 'export-btn', onClick: () => setSelectedEvent(selectedEvent?.id === event.id ? null : event), style: {padding: '6px 12px', fontSize: '13px'} }, selectedEvent?.id === event.id ? 'Close' : 'Edit'),
            React.createElement('button', { onClick: () => deleteEvent(event.id), style: {padding: '6px 12px', fontSize: '13px', background: 'var(--color-error)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'} }, 'Delete')
          )
        ),
        React.createElement('div', { style: {display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px'} },
          React.createElement('div', null, `📅 ${event.date}`),
          React.createElement('div', null, `🕒 ${event.time}`),
          React.createElement('div', null, `🏛️ ${event.venue}`),
          React.createElement('div', null, `🎨 ${event.theme}`),
          React.createElement('div', null, `💰 ₹${(event.budget/1000).toFixed(0)}K`)
        ),
        selectedEvent?.id === event.id && React.createElement('div', { style: {marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border)'} },
          React.createElement('h4', null, 'Event Details'),
          React.createElement('div', { style: {marginBottom: '12px'} },
            React.createElement('label', null, 'Dress Code: '),
            React.createElement('input', { type: 'text', value: event.dressCode, onChange: e => updateEvent(event.id, 'dressCode', e.target.value), style: {width: '100%'} })
          ),
          React.createElement('div', { style: {marginBottom: '12px'} },
            React.createElement('label', null, 'Notes: '),
            React.createElement('textarea', { value: event.notes, onChange: e => updateEvent(event.id, 'notes', e.target.value), style: {width: '100%', minHeight: '60px'} })
          ),
          event.groomEntry && React.createElement('div', { style: {background: 'var(--color-bg-3)', padding: '12px', borderRadius: '8px', marginBottom: '12px'} },
            React.createElement('h4', null, '🤵 Groom Entry'),
            React.createElement('p', null, `Time: ${event.groomEntry.time}`),
            React.createElement('p', null, `Music: ${event.groomEntry.music}`),
            React.createElement('p', null, `Sequence: ${event.groomEntry.sequence}`),
            React.createElement('p', null, `Costume: ${event.groomEntry.costume}`)
          ),
          event.brideEntry && React.createElement('div', { style: {background: 'var(--color-bg-7)', padding: '12px', borderRadius: '8px', marginBottom: '12px'} },
            React.createElement('h4', null, '👰 Bride Entry'),
            React.createElement('p', null, `Time: ${event.brideEntry.time}`),
            React.createElement('p', null, `Music: ${event.brideEntry.music}`),
            React.createElement('p', null, `Sequence: ${event.brideEntry.sequence}`),
            React.createElement('p', null, `Costume: ${event.brideEntry.costume}`)
          ),
          event.songs.length > 0 && React.createElement('div', { style: {marginTop: '12px'} },
            React.createElement('h4', null, '🎵 Songs & Performances'),
            React.createElement('table', { style: {width: '100%'} },
              React.createElement('thead', null,
                React.createElement('tr', null,
                  React.createElement('th', null, 'Order'),
                  React.createElement('th', null, 'Song'),
                  React.createElement('th', null, 'Artist'),
                  React.createElement('th', null, 'Duration'),
                  React.createElement('th', null, 'Performers')
                )
              ),
              React.createElement('tbody', null,
                event.songs.map(song => React.createElement('tr', { key: song.id },
                  React.createElement('td', null, song.order),
                  React.createElement('td', null, song.title),
                  React.createElement('td', null, song.artist),
                  React.createElement('td', null, song.duration),
                  React.createElement('td', null, song.performers.join(', '))
                ))
              )
            )
          ),
          event.name === 'Sangeet' && React.createElement('div', { style: {marginTop: '12px'} },
            React.createElement('button', { className: 'export-btn', onClick: () => setShowAddSong(!showAddSong) }, showAddSong ? 'Cancel' : '+ Add Song'),
            showAddSong && React.createElement('div', { style: {background: 'var(--color-bg-2)', padding: '12px', borderRadius: '8px', marginTop: '8px'} },
              React.createElement('input', { type: 'text', value: songTitle, onChange: e => setSongTitle(e.target.value), placeholder: 'Song title', style: {width: '100%', marginBottom: '8px'} }),
              React.createElement('input', { type: 'text', value: songArtist, onChange: e => setSongArtist(e.target.value), placeholder: 'Artist', style: {width: '100%', marginBottom: '8px'} }),
              React.createElement('input', { type: 'text', value: songDuration, onChange: e => setSongDuration(e.target.value), placeholder: 'Duration (e.g., 3:30)', style: {width: '100%', marginBottom: '8px'} }),
              React.createElement('input', { type: 'text', value: songPerformers, onChange: e => setSongPerformers(e.target.value), placeholder: 'Performers (comma-separated)', style: {width: '100%', marginBottom: '8px'} }),
              React.createElement('button', { className: 'export-btn', onClick: addSongToEvent }, 'Add Song')
            )
          )
        )
      ))
    )
  );
}

function Venues({ venues, setData, exportCSV, handleResetModule }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [stage, setStage] = useState(true);
  const [catering, setCatering] = useState(true);

  function addVenue() {
    if (!name) return;
    setData(prev => ({ ...prev, venues: [...prev.venues, { name, location, contact, stage, catering }] }));
    setName(""); setLocation(""); setContact("");
  }

  function exportVenues() {
    exportCSV(venues, ["name","location","contact","stage","catering"], "venues.csv");
  }

  return React.createElement('div', { className: 'section' },
    React.createElement('h2', { className: 'section-title' }, 'Manage Venues'),
    React.createElement('input', { type: 'text', value: name, onChange: e => setName(e.target.value), placeholder: 'Venue name' }),
    React.createElement('input', { type: 'text', value: location, onChange: e => setLocation(e.target.value), placeholder: 'Location' }),
    React.createElement('input', { type: 'text', value: contact, onChange: e => setContact(e.target.value), placeholder: 'Contact' }),
    React.createElement('label', null,
      React.createElement('input', { type: 'checkbox', checked: stage, onChange: e => setStage(e.target.checked) }),
      ' Stage available'
    ),
    React.createElement('label', null,
      React.createElement('input', { type: 'checkbox', checked: catering, onChange: e => setCatering(e.target.checked) }),
      ' Catering available'
    ),
    React.createElement('button', { className: 'export-btn', onClick: addVenue }, 'Add Venue'),
    React.createElement('button', { className: 'export-btn', onClick: exportVenues }, 'Export CSV'),
    React.createElement('button', { className: 'reset-btn', onClick: () => handleResetModule("Venues") }, 'Reset'),
    React.createElement('table', null,
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', null, 'Name'),
          React.createElement('th', null, 'Location'),
          React.createElement('th', null, 'Contact'),
          React.createElement('th', null, 'Stage'),
          React.createElement('th', null, 'Catering')
        )
      ),
      React.createElement('tbody', null,
        venues.map((venue, idx) => React.createElement('tr', { key: idx },
          React.createElement('td', null, venue.name),
          React.createElement('td', null, venue.location),
          React.createElement('td', null, venue.contact),
          React.createElement('td', null, venue.stage ? 'Yes' : 'No'),
          React.createElement('td', null, venue.catering ? 'Yes' : 'No')
        ))
      )
    )
  );
}



function FoodMenuPlanning({ menu, events, setData, exportCSV, handleResetModule }) {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [mealType, setMealType] = useState('Dinner');
  const [itemName, setItemName] = useState('');
  const [itemType, setItemType] = useState('Vegetarian');
  const [spiceLevel, setSpiceLevel] = useState('Medium');
  const [quantity, setQuantity] = useState('');
  const [allergens, setAllergens] = useState('');
  
  const addMenuItem = () => {
    if (!selectedEvent || !itemName) return;
    const existingMenu = menu.find(m => m.event === selectedEvent && m.mealType === mealType);
    if (existingMenu) {
      setData(prev => ({
        ...prev,
        menu: prev.menu.map(m => 
          m.id === existingMenu.id 
            ? {...m, items: [...m.items, {name: itemName, type: itemType, spiceLevel, quantity: parseInt(quantity) || 0, allergens}]}
            : m
        )
      }));
    } else {
      const newId = Math.max(0, ...menu.map(m => m.id)) + 1;
      setData(prev => ({
        ...prev,
        menu: [...prev.menu, {
          id: newId,
          event: selectedEvent,
          mealType,
          items: [{name: itemName, type: itemType, spiceLevel, quantity: parseInt(quantity) || 0, allergens}],
          caterer: 'Caterer',
          estimatedCost: 0
        }]
      }));
    }
    setItemName(''); setQuantity(''); setAllergens('');
  };
  
  return React.createElement('div', { className: 'section' },
    React.createElement('h2', { className: 'section-title' }, '🍴 Food Menu Planning'),
    React.createElement('button', { className: 'export-btn', onClick: () => exportCSV(menu, ['event','mealType','caterer','estimatedCost'], 'menu.csv') }, 'Export CSV'),
    React.createElement('h3', { style: {marginTop: '16px'} }, 'Add Menu Item'),
    React.createElement('div', { style: {background: 'var(--color-bg-2)', padding: '16px', borderRadius: '8px', marginBottom: '16px'} },
      React.createElement('select', { value: selectedEvent, onChange: e => setSelectedEvent(e.target.value), style: {width: '100%', marginBottom: '8px'} },
        React.createElement('option', { value: '' }, 'Select Event'),
        events.map(ev => React.createElement('option', { key: ev.id, value: ev.name }, ev.name))
      ),
      React.createElement('select', { value: mealType, onChange: e => setMealType(e.target.value), style: {width: '100%', marginBottom: '8px'} },
        React.createElement('option', null, 'Breakfast'),
        React.createElement('option', null, 'Lunch'),
        React.createElement('option', null, 'Dinner'),
        React.createElement('option', null, 'Snacks')
      ),
      React.createElement('input', { type: 'text', value: itemName, onChange: e => setItemName(e.target.value), placeholder: 'Item name', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('select', { value: itemType, onChange: e => setItemType(e.target.value), style: {width: '100%', marginBottom: '8px'} },
        React.createElement('option', null, 'Vegetarian'),
        React.createElement('option', null, 'Vegan'),
        React.createElement('option', null, 'Non-Veg'),
        React.createElement('option', null, 'Gluten-Free')
      ),
      React.createElement('select', { value: spiceLevel, onChange: e => setSpiceLevel(e.target.value), style: {width: '100%', marginBottom: '8px'} },
        React.createElement('option', null, 'None'),
        React.createElement('option', null, 'Mild'),
        React.createElement('option', null, 'Medium'),
        React.createElement('option', null, 'High')
      ),
      React.createElement('input', { type: 'number', value: quantity, onChange: e => setQuantity(e.target.value), placeholder: 'Quantity (servings)', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('input', { type: 'text', value: allergens, onChange: e => setAllergens(e.target.value), placeholder: 'Allergens (e.g., Dairy, Gluten)', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('button', { className: 'export-btn', onClick: addMenuItem }, 'Add Item')
    ),
    React.createElement('h3', null, 'Menus by Event'),
    menu.map(m => React.createElement('div', { key: m.id, style: {background: 'var(--color-bg-3)', padding: '16px', borderRadius: '8px', marginBottom: '16px'} },
      React.createElement('h4', null, `${m.event} - ${m.mealType}`),
      React.createElement('p', null, `Caterer: ${m.caterer} | Est. Cost: ₹${(m.estimatedCost/1000).toFixed(0)}K`),
      React.createElement('table', { style: {width: '100%', marginTop: '8px'} },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', null, 'Item'),
            React.createElement('th', null, 'Type'),
            React.createElement('th', null, 'Spice'),
            React.createElement('th', null, 'Qty'),
            React.createElement('th', null, 'Allergens')
          )
        ),
        React.createElement('tbody', null,
          m.items.map((item, idx) => React.createElement('tr', { key: idx },
            React.createElement('td', null, item.name),
            React.createElement('td', null, item.type),
            React.createElement('td', null, item.spiceLevel),
            React.createElement('td', null, item.quantity),
            React.createElement('td', null, item.allergens)
          ))
        )
      )
    ))
  );
}

function StaffPlanning({ staff, events, setData, exportCSV, handleResetModule }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Coordinator');
  const [contact, setContact] = useState('');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [shift, setShift] = useState('Full Day');
  const [payment, setPayment] = useState('');
  const [notes, setNotes] = useState('');
  
  const addStaff = () => {
    if (!name) return;
    const newId = Math.max(0, ...staff.map(s => s.id)) + 1;
    setData(prev => ({
      ...prev,
      staff: [...prev.staff, {
        id: newId,
        name,
        category,
        contact,
        events: selectedEvents,
        shift,
        payment: parseInt(payment) || 0,
        paid: false,
        notes
      }]
    }));
    setName(''); setContact(''); setSelectedEvents([]); setPayment(''); setNotes('');
  };
  
  return React.createElement('div', { className: 'section' },
    React.createElement('h2', { className: 'section-title' }, '👥 Staff Planning'),
    React.createElement('button', { className: 'export-btn', onClick: () => exportCSV(staff, ['name','category','contact','shift','payment'], 'staff.csv') }, 'Export CSV'),
    React.createElement('h3', { style: {marginTop: '16px'} }, 'Add Staff Member'),
    React.createElement('div', { style: {background: 'var(--color-bg-4)', padding: '16px', borderRadius: '8px', marginBottom: '16px'} },
      React.createElement('input', { type: 'text', value: name, onChange: e => setName(e.target.value), placeholder: 'Staff name', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('select', { value: category, onChange: e => setCategory(e.target.value), style: {width: '100%', marginBottom: '8px'} },
        React.createElement('option', null, 'Coordinator'),
        React.createElement('option', null, 'Caterer'),
        React.createElement('option', null, 'Decorator'),
        React.createElement('option', null, 'Photographer'),
        React.createElement('option', null, 'Videographer'),
        React.createElement('option', null, 'DJ'),
        React.createElement('option', null, 'MC'),
        React.createElement('option', null, 'Security')
      ),
      React.createElement('input', { type: 'text', value: contact, onChange: e => setContact(e.target.value), placeholder: 'Contact', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('label', null, 'Assigned Events:'),
      events.map(ev => React.createElement('label', { key: ev.id, style: {display: 'block', marginBottom: '4px'} },
        React.createElement('input', { type: 'checkbox', checked: selectedEvents.includes(ev.name), onChange: e => {
          if (e.target.checked) setSelectedEvents([...selectedEvents, ev.name]);
          else setSelectedEvents(selectedEvents.filter(n => n !== ev.name));
        } }),
        ' ' + ev.name
      )),
      React.createElement('select', { value: shift, onChange: e => setShift(e.target.value), style: {width: '100%', marginTop: '8px', marginBottom: '8px'} },
        React.createElement('option', null, 'Full Day'),
        React.createElement('option', null, 'Morning'),
        React.createElement('option', null, 'Evening'),
        React.createElement('option', null, 'Event Hours')
      ),
      React.createElement('input', { type: 'number', value: payment, onChange: e => setPayment(e.target.value), placeholder: 'Payment amount', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('textarea', { value: notes, onChange: e => setNotes(e.target.value), placeholder: 'Notes', style: {width: '100%', marginBottom: '8px', minHeight: '60px'} }),
      React.createElement('button', { className: 'export-btn', onClick: addStaff }, 'Add Staff')
    ),
    React.createElement('table', null,
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', null, 'Name'),
          React.createElement('th', null, 'Category'),
          React.createElement('th', null, 'Events'),
          React.createElement('th', null, 'Shift'),
          React.createElement('th', null, 'Payment'),
          React.createElement('th', null, 'Status')
        )
      ),
      React.createElement('tbody', null,
        staff.map(s => React.createElement('tr', { key: s.id },
          React.createElement('td', null, s.name),
          React.createElement('td', null, s.category),
          React.createElement('td', null, s.events.join(', ')),
          React.createElement('td', null, s.shift),
          React.createElement('td', null, `₹${s.payment.toLocaleString()}`),
          React.createElement('td', null, s.paid ? '✅ Paid' : '⏳ Pending')
        ))
      )
    )
  );
}

function GiftPlanning({ gifts, setData, exportCSV, handleResetModule }) {
  const [type, setType] = useState('Gift Received');
  const [from, setFrom] = useState('');
  const [item, setItem] = useState('');
  const [value, setValue] = useState('');
  const [quantity, setQuantity] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');
  
  const addGift = () => {
    if (!item) return;
    const newId = Math.max(0, ...gifts.map(g => g.id)) + 1;
    const today = new Date().toISOString().split('T')[0];
    if (type === 'Return Gift') {
      setData(prev => ({
        ...prev,
        gifts: [...prev.gifts, {
          id: newId,
          type,
          item,
          quantity: parseInt(quantity) || 0,
          costPerUnit: parseInt(costPerUnit) || 0,
          totalCost: (parseInt(quantity) || 0) * (parseInt(costPerUnit) || 0),
          ordered: false,
          delivered: false,
          notes: ''
        }]
      }));
    } else {
      setData(prev => ({
        ...prev,
        gifts: [...prev.gifts, {
          id: newId,
          type,
          from,
          item,
          value: parseInt(value) || 0,
          receivedDate: today,
          thankYouSent: false,
          notes: ''
        }]
      }));
    }
    setFrom(''); setItem(''); setValue(''); setQuantity(''); setCostPerUnit('');
  };
  
  return React.createElement('div', { className: 'section' },
    React.createElement('h2', { className: 'section-title' }, '🎁 Gift Planning'),
    React.createElement('button', { className: 'export-btn', onClick: () => exportCSV(gifts, ['type','item','from','value'], 'gifts.csv') }, 'Export CSV'),
    React.createElement('h3', { style: {marginTop: '16px'} }, 'Add Gift'),
    React.createElement('div', { style: {background: 'var(--color-bg-5)', padding: '16px', borderRadius: '8px', marginBottom: '16px'} },
      React.createElement('select', { value: type, onChange: e => setType(e.target.value), style: {width: '100%', marginBottom: '8px'} },
        React.createElement('option', null, 'Gift Received'),
        React.createElement('option', null, 'Return Gift'),
        React.createElement('option', null, 'Cash Gift'),
        React.createElement('option', null, 'Gold/Jewelry')
      ),
      type === 'Return Gift' ? (
        React.createElement('div', null,
          React.createElement('input', { type: 'text', value: item, onChange: e => setItem(e.target.value), placeholder: 'Gift item', style: {width: '100%', marginBottom: '8px'} }),
          React.createElement('input', { type: 'number', value: quantity, onChange: e => setQuantity(e.target.value), placeholder: 'Quantity', style: {width: '100%', marginBottom: '8px'} }),
          React.createElement('input', { type: 'number', value: costPerUnit, onChange: e => setCostPerUnit(e.target.value), placeholder: 'Cost per unit', style: {width: '100%', marginBottom: '8px'} }),
          React.createElement('p', null, `Total: ₹${((parseInt(quantity) || 0) * (parseInt(costPerUnit) || 0)).toLocaleString()}`)
        )
      ) : (
        React.createElement('div', null,
          React.createElement('input', { type: 'text', value: from, onChange: e => setFrom(e.target.value), placeholder: 'From (name)', style: {width: '100%', marginBottom: '8px'} }),
          React.createElement('input', { type: 'text', value: item, onChange: e => setItem(e.target.value), placeholder: 'Gift description', style: {width: '100%', marginBottom: '8px'} }),
          React.createElement('input', { type: 'number', value: value, onChange: e => setValue(e.target.value), placeholder: 'Estimated value', style: {width: '100%', marginBottom: '8px'} })
        )
      ),
      React.createElement('button', { className: 'export-btn', onClick: addGift }, 'Add Gift')
    ),
    React.createElement('h3', null, 'Gifts Received'),
    React.createElement('table', null,
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', null, 'Type'),
          React.createElement('th', null, 'From'),
          React.createElement('th', null, 'Item'),
          React.createElement('th', null, 'Value'),
          React.createElement('th', null, 'Thank You')
        )
      ),
      React.createElement('tbody', null,
        gifts.filter(g => g.type !== 'Return Gift').map(g => React.createElement('tr', { key: g.id },
          React.createElement('td', null, g.type),
          React.createElement('td', null, g.from),
          React.createElement('td', null, g.item),
          React.createElement('td', null, `₹${g.value?.toLocaleString() || 0}`),
          React.createElement('td', null, g.thankYouSent ? '✅' : '❌')
        ))
      )
    ),
    React.createElement('h3', { style: {marginTop: '24px'} }, 'Return Gifts'),
    React.createElement('table', null,
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', null, 'Item'),
          React.createElement('th', null, 'Quantity'),
          React.createElement('th', null, 'Cost/Unit'),
          React.createElement('th', null, 'Total'),
          React.createElement('th', null, 'Status')
        )
      ),
      React.createElement('tbody', null,
        gifts.filter(g => g.type === 'Return Gift').map(g => React.createElement('tr', { key: g.id },
          React.createElement('td', null, g.item),
          React.createElement('td', null, g.quantity),
          React.createElement('td', null, `₹${g.costPerUnit?.toLocaleString() || 0}`),
          React.createElement('td', null, `₹${g.totalCost?.toLocaleString() || 0}`),
          React.createElement('td', null, g.delivered ? '✅ Delivered' : g.ordered ? '📦 Ordered' : '⏳ Pending')
        ))
      )
    )
  );
}

function FunctionReturnMoney({ returnMoney, setData, exportCSV, handleResetModule }) {
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState('Decoration');
  const [advance, setAdvance] = useState('');
  const [finalPayment, setFinalPayment] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  const addReturn = () => {
    if (!vendor) return;
    const newId = Math.max(0, ...returnMoney.map(r => r.id)) + 1;
    const adv = parseInt(advance) || 0;
    const final = parseInt(finalPayment) || 0;
    const total = adv + final;
    setData(prev => ({
      ...prev,
      returnMoney: [...prev.returnMoney, {
        id: newId,
        vendor,
        category,
        amountGiven: total,
        advance: adv,
        finalPayment: final,
        balanceDue: final,
        dueDate,
        paid: false,
        paymentDate: null,
        notes: ''
      }]
    }));
    setVendor(''); setAdvance(''); setFinalPayment(''); setDueDate('');
  };
  
  return React.createElement('div', { className: 'section' },
    React.createElement('h2', { className: 'section-title' }, '💵 Function Return Money'),
    React.createElement('button', { className: 'export-btn', onClick: () => exportCSV(returnMoney, ['vendor','category','amountGiven','advance','finalPayment','balanceDue','paid'], 'return-money.csv') }, 'Export CSV'),
    React.createElement('h3', { style: {marginTop: '16px'} }, 'Add Payment Record'),
    React.createElement('div', { style: {background: 'var(--color-bg-6)', padding: '16px', borderRadius: '8px', marginBottom: '16px'} },
      React.createElement('input', { type: 'text', value: vendor, onChange: e => setVendor(e.target.value), placeholder: 'Vendor/Staff name', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('select', { value: category, onChange: e => setCategory(e.target.value), style: {width: '100%', marginBottom: '8px'} },
        React.createElement('option', null, 'Decoration'),
        React.createElement('option', null, 'Catering'),
        React.createElement('option', null, 'Photography'),
        React.createElement('option', null, 'Entertainment'),
        React.createElement('option', null, 'Staff'),
        React.createElement('option', null, 'Transportation')
      ),
      React.createElement('input', { type: 'number', value: advance, onChange: e => setAdvance(e.target.value), placeholder: 'Advance paid', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('input', { type: 'number', value: finalPayment, onChange: e => setFinalPayment(e.target.value), placeholder: 'Final payment due', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('input', { type: 'date', value: dueDate, onChange: e => setDueDate(e.target.value), placeholder: 'Due date', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('button', { className: 'export-btn', onClick: addReturn }, 'Add Record')
    ),
    React.createElement('table', null,
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', null, 'Vendor'),
          React.createElement('th', null, 'Category'),
          React.createElement('th', null, 'Total'),
          React.createElement('th', null, 'Advance'),
          React.createElement('th', null, 'Balance Due'),
          React.createElement('th', null, 'Due Date'),
          React.createElement('th', null, 'Status')
        )
      ),
      React.createElement('tbody', null,
        returnMoney.map(r => React.createElement('tr', { key: r.id },
          React.createElement('td', null, r.vendor),
          React.createElement('td', null, r.category),
          React.createElement('td', null, `₹${r.amountGiven.toLocaleString()}`),
          React.createElement('td', null, `₹${r.advance.toLocaleString()}`),
          React.createElement('td', { style: {fontWeight: 'bold', color: r.balanceDue > 0 ? 'var(--color-warning)' : 'var(--color-success)'} }, `₹${r.balanceDue.toLocaleString()}`),
          React.createElement('td', null, r.dueDate),
          React.createElement('td', null, r.paid ? '✅ Paid' : '⏳ Pending')
        ))
      )
    )
  );
}

function GuestSchedules({ guests, events, setData }) {
  return React.createElement('div', { className: 'section' },
    React.createElement('h2', { className: 'section-title' }, '📝 Guest Schedules'),
    React.createElement('p', null, 'View which guests are attending which events'),
    guests.map(guest => React.createElement('div', { key: guest.id, style: {background: 'var(--color-bg-1)', padding: '12px', borderRadius: '8px', marginBottom: '12px'} },
      React.createElement('h4', null, guest.name),
      React.createElement('div', { style: {display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px'} },
        React.createElement('div', null, `👥 ${guest.group}`),
        React.createElement('div', null, `🍽️ ${guest.dietary}`),
        React.createElement('div', null, `📞 ${guest.contact}`),
        React.createElement('div', null, `RSVP: ${guest.rsvp}`)
      ),
      React.createElement('div', { style: {marginTop: '8px'} },
        React.createElement('strong', null, 'Attending Events:'),
        React.createElement('div', { style: {display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px'} },
          guest.events.length > 0 ? guest.events.map(evName => {
            const ev = events.find(e => e.name === evName);
            return ev && React.createElement('span', { key: evName, style: {background: 'var(--color-bg-3)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'} },
              `${ev.name} (${ev.date})`
            );
          }) : React.createElement('span', null, 'No events assigned')
        )
      ),
      guest.accommodation && React.createElement('div', { style: {marginTop: '8px'} },
        React.createElement('strong', null, 'Accommodation: '),
        guest.accommodation
      )
    ))
  );
}

function VendorManagement({ vendors, setData, exportCSV, handleResetModule }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Decorator');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [rate, setRate] = useState('');
  
  const addVendor = () => {
    if (!name) return;
    const newId = Math.max(0, ...vendors.map(v => v.id)) + 1;
    setData(prev => ({
      ...prev,
      vendors: [...prev.vendors, {
        id: newId,
        name,
        type,
        contact,
        email,
        rate: parseInt(rate) || 0,
        advancePaid: 0,
        finalPaid: false,
        rating: 0,
        notes: ''
      }]
    }));
    setName(''); setContact(''); setEmail(''); setRate('');
  };
  
  return React.createElement('div', { className: 'section' },
    React.createElement('h2', { className: 'section-title' }, '💼 Vendor Management'),
    React.createElement('button', { className: 'export-btn', onClick: () => exportCSV(vendors, ['name','type','contact','rate','rating'], 'vendors.csv') }, 'Export CSV'),
    React.createElement('h3', { style: {marginTop: '16px'} }, 'Add Vendor'),
    React.createElement('div', { style: {background: 'var(--color-bg-7)', padding: '16px', borderRadius: '8px', marginBottom: '16px'} },
      React.createElement('input', { type: 'text', value: name, onChange: e => setName(e.target.value), placeholder: 'Vendor name', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('select', { value: type, onChange: e => setType(e.target.value), style: {width: '100%', marginBottom: '8px'} },
        React.createElement('option', null, 'Decorator'),
        React.createElement('option', null, 'Caterer'),
        React.createElement('option', null, 'Photographer'),
        React.createElement('option', null, 'DJ'),
        React.createElement('option', null, 'Videographer')
      ),
      React.createElement('input', { type: 'text', value: contact, onChange: e => setContact(e.target.value), placeholder: 'Contact number', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('input', { type: 'email', value: email, onChange: e => setEmail(e.target.value), placeholder: 'Email', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('input', { type: 'number', value: rate, onChange: e => setRate(e.target.value), placeholder: 'Rate/Cost', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('button', { className: 'export-btn', onClick: addVendor }, 'Add Vendor')
    ),
    React.createElement('table', null,
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', null, 'Name'),
          React.createElement('th', null, 'Type'),
          React.createElement('th', null, 'Contact'),
          React.createElement('th', null, 'Rate'),
          React.createElement('th', null, 'Rating')
        )
      ),
      React.createElement('tbody', null,
        vendors.map(v => React.createElement('tr', { key: v.id },
          React.createElement('td', null, v.name),
          React.createElement('td', null, v.type),
          React.createElement('td', null, v.contact),
          React.createElement('td', null, `₹${v.rate.toLocaleString()}`),
          React.createElement('td', null, '⭐'.repeat(v.rating))
        ))
      )
    )
  );
}

function Vendors({ vendors, setData, exportCSV, handleResetModule }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  function addVendor() {
    if (!name) return;
    setData(prev => ({ ...prev, vendors: [...prev.vendors, { name, contact, paid: false, rating: 0 }] }));
    setName(""); setContact("");
  }

  function exportVendors() {
    exportCSV(vendors, ["name","contact","paid","rating"], "vendors.csv");
  }

  function togglePaid(idx) {
    setData(prev => {
      const arr = [...prev.vendors];
      arr[idx].paid = !arr[idx].paid;
      return { ...prev, vendors: arr };
    });
  }

  return React.createElement('div', { className: 'section' },
    React.createElement('h2', { className: 'section-title' }, 'Vendor Management'),
    React.createElement('input', { type: 'text', value: name, onChange: e => setName(e.target.value), placeholder: 'Vendor name' }),
    React.createElement('input', { type: 'text', value: contact, onChange: e => setContact(e.target.value), placeholder: 'Contact' }),
    React.createElement('button', { className: 'export-btn', onClick: addVendor }, 'Add Vendor'),
    React.createElement('button', { className: 'export-btn', onClick: exportVendors }, 'Export CSV'),
    React.createElement('button', { className: 'reset-btn', onClick: () => handleResetModule("Vendor Management") }, 'Reset'),
    React.createElement('table', null,
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', null, 'Name'),
          React.createElement('th', null, 'Contact'),
          React.createElement('th', null, 'Payment Status'),
          React.createElement('th', null, 'Rating')
        )
      ),
      React.createElement('tbody', null,
        vendors.map((vendor, idx) => React.createElement('tr', { key: idx },
          React.createElement('td', null, vendor.name),
          React.createElement('td', null, vendor.contact),
          React.createElement('td', null,
            React.createElement('button', { onClick: () => togglePaid(idx) }, vendor.paid ? 'Paid' : 'Pending')
          ),
          React.createElement('td', null, vendor.rating)
        ))
      )
    )
  );
}

function TasksChecklist({ tasks, guests, setData, exportCSV, handleResetModule }) {
  const [name, setName] = useState("");
  const [assignee, setAssignee] = useState("");
  const [deadline, setDeadline] = useState("");

  function addTask() {
    if (!name) return;
    setData(prev => ({ ...prev, tasks: [...prev.tasks, { name, assignee, deadline, done: false }] }));
    setName(""); setAssignee(""); setDeadline("");
  }

  function exportTasks() {
    exportCSV(tasks, ["name","assignee","deadline","done"], "tasks.csv");
  }

  function toggleDone(idx) {
    setData(prev => {
      const arr = [...prev.tasks];
      arr[idx].done = !arr[idx].done;
      return { ...prev, tasks: arr };
    });
  }

  return React.createElement('div', { className: 'section' },
    React.createElement('h2', { className: 'section-title' }, 'Task Checklist'),
    React.createElement('input', { type: 'text', value: name, onChange: e => setName(e.target.value), placeholder: 'Task name' }),
    React.createElement('input', { type: 'text', value: assignee, onChange: e => setAssignee(e.target.value), placeholder: 'Assignee' }),
    React.createElement('input', { type: 'text', value: deadline, onChange: e => setDeadline(e.target.value), placeholder: 'Deadline' }),
    React.createElement('button', { className: 'export-btn', onClick: addTask }, 'Add Task'),
    React.createElement('button', { className: 'export-btn', onClick: exportTasks }, 'Export CSV'),
    React.createElement('button', { className: 'reset-btn', onClick: () => handleResetModule("Task Checklist") }, 'Reset'),
    React.createElement('table', null,
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', null, 'Task'),
          React.createElement('th', null, 'Assignee'),
          React.createElement('th', null, 'Deadline'),
          React.createElement('th', null, 'Status')
        )
      ),
      React.createElement('tbody', null,
        tasks.map((task, idx) => React.createElement('tr', { key: idx },
          React.createElement('td', null, task.name),
          React.createElement('td', null, task.assignee),
          React.createElement('td', null, task.deadline),
          React.createElement('td', null,
            React.createElement('button', { onClick: () => toggleDone(idx) }, task.done ? 'Done' : 'Pending')
          )
        ))
      )
    )
  );
}

function Shopping({ shopping, vendors, setData, exportCSV, handleResetModule }) {
  const [item, setItem] = useState("");

  function addItem() {
    if (!item) return;
    setData(prev => ({ ...prev, shopping: [...prev.shopping, { item, options: [], shortlisted: false, delivered: false }] }));
    setItem("");
  }

  function exportShopping() {
    exportCSV(shopping, ["item","shortlisted","delivered"], "shopping.csv");
  }

  return React.createElement('div', { className: 'section' },
    React.createElement('h2', { className: 'section-title' }, 'Shopping/Price Comparison'),
    React.createElement('input', { type: 'text', value: item, onChange: e => setItem(e.target.value), placeholder: 'Item name' }),
    React.createElement('button', { className: 'export-btn', onClick: addItem }, 'Add Item'),
    React.createElement('button', { className: 'export-btn', onClick: exportShopping }, 'Export CSV'),
    React.createElement('button', { className: 'reset-btn', onClick: () => handleResetModule("Shopping/Price Comparison") }, 'Reset'),
    React.createElement('table', null,
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', null, 'Item'),
          React.createElement('th', null, 'Shortlisted'),
          React.createElement('th', null, 'Delivered')
        )
      ),
      React.createElement('tbody', null,
        shopping.map((sh, idx) => React.createElement('tr', { key: idx },
          React.createElement('td', null, sh.item),
          React.createElement('td', null, sh.shortlisted ? 'Yes' : 'No'),
          React.createElement('td', null, sh.delivered ? 'Yes' : 'No')
        ))
      )
    )
  );
}

function Invitations({ invitations, guests, setData, exportCSV, handleResetModule }) {
  const [type, setType] = useState("Print");
  const [template, setTemplate] = useState("Classic Red");

  function addInvitation() {
    setData(prev => ({ ...prev, invitations: [...prev.invitations, { type, template, guestsSent: [], guestsResponded: [] }] }));
    setType("Print"); setTemplate("Classic Red");
  }

  function exportInvitations() {
    exportCSV(invitations, ["type","template"], "invitations.csv");
  }

  return React.createElement('div', { className: 'section' },
    React.createElement('h2', { className: 'section-title' }, 'Invitations'),
    React.createElement('select', { value: type, onChange: e => setType(e.target.value) },
      React.createElement('option', { value: 'Print' }, 'Print'),
      React.createElement('option', { value: 'E-Invite' }, 'E-Invite')
    ),
    React.createElement('input', { type: 'text', value: template, onChange: e => setTemplate(e.target.value), placeholder: 'Template name' }),
    React.createElement('button', { className: 'export-btn', onClick: addInvitation }, 'Add Invitation'),
    React.createElement('button', { className: 'export-btn', onClick: exportInvitations }, 'Export CSV'),
    React.createElement('button', { className: 'reset-btn', onClick: () => handleResetModule("Invitations") }, 'Reset'),
    React.createElement('table', null,
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', null, 'Type'),
          React.createElement('th', null, 'Template'),
          React.createElement('th', null, 'Guests Sent'),
          React.createElement('th', null, 'Guests Responded')
        )
      ),
      React.createElement('tbody', null,
        invitations.map((inv, idx) => React.createElement('tr', { key: idx },
          React.createElement('td', null, inv.type),
          React.createElement('td', null, inv.template),
          React.createElement('td', null, inv.guestsSent.length),
          React.createElement('td', null, inv.guestsResponded.length)
        ))
      )
    )
  );
}

function Accommodation({ accommodation, guests, setData, exportCSV, handleResetModule }) {
  const [hotel, setHotel] = useState("");
  const [rooms, setRooms] = useState("");

  function addAccommodation() {
    if (!hotel) return;
    setData(prev => ({ ...prev, accommodation: [...prev.accommodation, { hotel, rooms: parseInt(rooms) || 0, guests: [] }] }));
    setHotel(""); setRooms("");
  }

  function exportAccommodation() {
    exportCSV(accommodation, ["hotel","rooms"], "accommodation.csv");
  }

  return React.createElement('div', { className: 'section' },
    React.createElement('h2', { className: 'section-title' }, 'Accommodation Logistics'),
    React.createElement('input', { type: 'text', value: hotel, onChange: e => setHotel(e.target.value), placeholder: 'Hotel name' }),
    React.createElement('input', { type: 'number', value: rooms, onChange: e => setRooms(e.target.value), placeholder: 'Rooms' }),
    React.createElement('button', { className: 'export-btn', onClick: addAccommodation }, 'Add Accommodation'),
    React.createElement('button', { className: 'export-btn', onClick: exportAccommodation }, 'Export CSV'),
    React.createElement('button', { className: 'reset-btn', onClick: () => handleResetModule("Accommodation Logistics") }, 'Reset'),
    React.createElement('table', null,
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', null, 'Hotel'),
          React.createElement('th', null, 'Rooms'),
          React.createElement('th', null, 'Guests Assigned')
        )
      ),
      React.createElement('tbody', null,
        accommodation.map((acc, idx) => React.createElement('tr', { key: idx },
          React.createElement('td', null, acc.hotel),
          React.createElement('td', null, acc.rooms),
          React.createElement('td', null, acc.guests.length)
        ))
      )
    )
  );
}

function MenuPlanning({ menu, events, vendors, setData, exportCSV, handleResetModule }) {
  const [eventName, setEventName] = useState("");
  const [items, setItems] = useState("");
  const [veg, setVeg] = useState(true);
  const [caterer, setCaterer] = useState("");

  function addMenu() {
    if (!eventName) return;
    setData(prev => ({ ...prev, menu: [...prev.menu, { event: eventName, items: items.split(','), veg, caterer }] }));
    setEventName(""); setItems(""); setCaterer("");
  }

  function exportMenu() {
    exportCSV(menu, ["event","items","veg","caterer"], "menu.csv");
  }

  return React.createElement('div', { className: 'section' },
    React.createElement('h2', { className: 'section-title' }, 'Food Menu Planning'),
    React.createElement('input', { type: 'text', value: eventName, onChange: e => setEventName(e.target.value), placeholder: 'Event name' }),
    React.createElement('input', { type: 'text', value: items, onChange: e => setItems(e.target.value), placeholder: 'Items (comma-separated)' }),
    React.createElement('label', null,
      React.createElement('input', { type: 'checkbox', checked: veg, onChange: e => setVeg(e.target.checked) }),
      ' Vegetarian'
    ),
    React.createElement('input', { type: 'text', value: caterer, onChange: e => setCaterer(e.target.value), placeholder: 'Caterer' }),
    React.createElement('button', { className: 'export-btn', onClick: addMenu }, 'Add Menu'),
    React.createElement('button', { className: 'export-btn', onClick: exportMenu }, 'Export CSV'),
    React.createElement('button', { className: 'reset-btn', onClick: () => handleResetModule("Food Menu Planning") }, 'Reset'),
    React.createElement('table', null,
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', null, 'Event'),
          React.createElement('th', null, 'Items'),
          React.createElement('th', null, 'Vegetarian'),
          React.createElement('th', null, 'Caterer')
        )
      ),
      React.createElement('tbody', null,
        menu.map((m, idx) => React.createElement('tr', { key: idx },
          React.createElement('td', null, m.event),
          React.createElement('td', null, m.items.join(', ')),
          React.createElement('td', null, m.veg ? 'Yes' : 'No'),
          React.createElement('td', null, m.caterer)
        ))
      )
    )
  );
}

function FamilyTree({ family, setData, exportCSV, handleResetModule }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [relation, setRelation] = useState("");
  const [group, setGroup] = useState("");

  function addMember() {
    if (!name) return;
    setData(prev => ({ ...prev, family: [...prev.family, { name, role, relation, photo: "", group }] }));
    setName(""); setRole(""); setRelation(""); setGroup("");
  }

  function exportFamily() {
    exportCSV(family, ["name","role","relation","group"], "family.csv");
  }

  return React.createElement('div', { className: 'section' },
    React.createElement('h2', { className: 'section-title' }, 'Family Tree'),
    React.createElement('div', { className: 'family-tree' },
      family.map((member, idx) => React.createElement('div', { className: 'family-member', key: idx },
        React.createElement('div', { className: 'family-member-photo' }),
        React.createElement('div', { className: 'family-member-name' }, member.name),
        React.createElement('div', { className: 'family-member-role' }, member.role)
      ))
    ),
    React.createElement('input', { type: 'text', value: name, onChange: e => setName(e.target.value), placeholder: 'Name' }),
    React.createElement('input', { type: 'text', value: role, onChange: e => setRole(e.target.value), placeholder: 'Role (Groom/Bride/Parent)' }),
    React.createElement('input', { type: 'text', value: relation, onChange: e => setRelation(e.target.value), placeholder: 'Relation' }),
    React.createElement('input', { type: 'text', value: group, onChange: e => setGroup(e.target.value), placeholder: 'Family group' }),
    React.createElement('button', { className: 'export-btn', onClick: addMember }, 'Add Member'),
    React.createElement('button', { className: 'export-btn', onClick: exportFamily }, 'Export CSV'),
    React.createElement('button', { className: 'reset-btn', onClick: () => handleResetModule("Family Tree") }, 'Reset')
  );
}

function Transportation({ transport, guests, setData, exportCSV, handleResetModule }) {
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");
  const [group, setGroup] = useState("");

  function addTransport() {
    if (!type) return;
    setData(prev => ({ ...prev, transport: [...prev.transport, { type, details, group }] }));
    setType(""); setDetails(""); setGroup("");
  }

  function exportTransport() {
    exportCSV(transport, ["type","details","group"], "transport.csv");
  }

  return React.createElement('div', { className: 'section' },
    React.createElement('h2', { className: 'section-title' }, '🚌 Transportation Scheduling'),
    React.createElement('button', { className: 'export-btn', onClick: exportTransport }, 'Export CSV'),
    React.createElement('button', { className: 'reset-btn', onClick: () => handleResetModule('Transportation') }, 'Reset'),
    React.createElement('h3', { style: {marginTop: '16px'} }, 'Add Transport'),
    React.createElement('div', { style: {background: 'var(--color-bg-8)', padding: '16px', borderRadius: '8px', marginBottom: '16px'} },
      React.createElement('input', { type: 'text', value: type, onChange: e => setType(e.target.value), placeholder: 'Type (Bus/Train/Flight)', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('input', { type: 'text', value: details, onChange: e => setDetails(e.target.value), placeholder: 'Route details', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('input', { type: 'text', value: group, onChange: e => setGroup(e.target.value), placeholder: 'Group name', style: {width: '100%', marginBottom: '8px'} }),
      React.createElement('button', { className: 'export-btn', onClick: addTransport }, 'Add Transport')
    ),
    React.createElement('table', null,
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', null, 'Type'),
          React.createElement('th', null, 'Route'),
          React.createElement('th', null, 'Date'),
          React.createElement('th', null, 'Time'),
          React.createElement('th', null, 'Group'),
          React.createElement('th', null, 'Capacity'),
          React.createElement('th', null, 'Booked')
        )
      ),
      React.createElement('tbody', null,
        transport.map(t => React.createElement('tr', { key: t.id },
          React.createElement('td', null, t.type),
          React.createElement('td', null, t.details),
          React.createElement('td', null, t.date),
          React.createElement('td', null, t.time),
          React.createElement('td', null, t.group),
          React.createElement('td', null, t.capacity),
          React.createElement('td', null, t.booked)
        ))
      )
    )
  );
}

// --- End Module Components --- //

ReactDOM.render(
  React.createElement(App),
  document.getElementById('root')
);
