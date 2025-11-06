export const defaultData = {
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
  }
};