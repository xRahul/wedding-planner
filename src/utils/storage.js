// Storage wrapper that works in both normal and sandboxed environments
export const Storage = {
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