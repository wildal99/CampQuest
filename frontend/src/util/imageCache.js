class ImageCache {
  constructor() {
    this.cache = this.loadFromLocalStorage();
  }

  loadFromLocalStorage() {
    const cacheData = localStorage.getItem('image_cache');
    return cacheData ? new Map(JSON.parse(cacheData)) : new Map();
  }

  saveToLocalStorage() {
    localStorage.setItem('image_cache', JSON.stringify(Array.from(this.cache.entries())));
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value) {
    if (this.cache.size > 200) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
    this.saveToLocalStorage();
  }

  has(key) {
    return this.cache.has(key);
  }
}

export default new ImageCache();
