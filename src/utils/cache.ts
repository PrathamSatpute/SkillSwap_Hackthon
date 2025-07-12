// Cache utility for performance optimization
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheOptions {
  ttl?: number; // Default TTL in milliseconds
  maxSize?: number; // Maximum number of items in cache
}

export class Cache {
  private storage: Map<string, CacheItem<any>>;
  private ttl: number;
  private maxSize: number;

  constructor(options: CacheOptions = {}) {
    this.storage = new Map();
    this.ttl = options.ttl || 5 * 60 * 1000; // 5 minutes default
    this.maxSize = options.maxSize || 100; // 100 items default
  }

  // Set item in cache
  set<T>(key: string, data: T, ttl?: number): void {
    // Remove expired items
    this.cleanup();

    // Check if cache is full
    if (this.storage.size >= this.maxSize) {
      this.evictOldest();
    }

    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.ttl
    };

    this.storage.set(key, item);
  }

  // Get item from cache
  get<T>(key: string): T | null {
    const item = this.storage.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item is expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.storage.delete(key);
      return null;
    }

    return item.data;
  }

  // Check if key exists and is not expired
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // Remove item from cache
  delete(key: string): boolean {
    return this.storage.delete(key);
  }

  // Clear all items
  clear(): void {
    this.storage.clear();
  }

  // Get cache size
  size(): number {
    this.cleanup();
    return this.storage.size;
  }

  // Get all keys
  keys(): string[] {
    this.cleanup();
    return Array.from(this.storage.keys());
  }

  // Clean up expired items
  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.storage.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.storage.delete(key);
      }
    }
  }

  // Evict oldest item (LRU strategy)
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, item] of this.storage.entries()) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.storage.delete(oldestKey);
    }
  }

  // Get cache statistics
  getStats() {
    this.cleanup();
    return {
      size: this.storage.size,
      maxSize: this.maxSize,
      ttl: this.ttl
    };
  }
}

// Global cache instances
export const userCache = new Cache({ ttl: 10 * 60 * 1000, maxSize: 50 }); // 10 minutes
export const searchCache = new Cache({ ttl: 2 * 60 * 1000, maxSize: 20 }); // 2 minutes
export const skillCache = new Cache({ ttl: 30 * 60 * 1000, maxSize: 100 }); // 30 minutes

// Cache decorator for functions
export function cached<T extends (...args: any[]) => any>(
  cache: Cache,
  keyGenerator?: (...args: Parameters<T>) => string
) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = function (...args: Parameters<T>): ReturnType<T> {
      const key = keyGenerator 
        ? keyGenerator(...args)
        : `${propertyName}_${JSON.stringify(args)}`;

      const cachedResult = cache.get<ReturnType<T>>(key);
      if (cachedResult !== null) {
        return cachedResult;
      }

      const result = method.apply(this, args);
      
      // Handle promises
      if (result instanceof Promise) {
        return result.then((resolvedResult) => {
          cache.set(key, resolvedResult);
          return resolvedResult;
        }) as ReturnType<T>;
      }

      cache.set(key, result);
      return result;
    };
  };
}

// Async cache wrapper
export async function withCache<T>(
  cache: Cache,
  key: string,
  operation: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const cachedResult = cache.get<T>(key);
  if (cachedResult !== null) {
    return cachedResult;
  }

  const result = await operation();
  cache.set(key, result, ttl);
  return result;
}

// Local storage cache wrapper
export class LocalStorageCache {
  private prefix: string;
  private ttl: number;

  constructor(prefix: string = 'app_cache', ttl: number = 24 * 60 * 60 * 1000) {
    this.prefix = prefix;
    this.ttl = ttl; // 24 hours default
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.ttl
    };

    try {
      localStorage.setItem(`${this.prefix}_${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(`${this.prefix}_${key}`);
      if (!item) return null;

      const cacheItem: CacheItem<T> = JSON.parse(item);
      
      if (Date.now() - cacheItem.timestamp > cacheItem.ttl) {
        this.delete(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  }

  delete(key: string): void {
    try {
      localStorage.removeItem(`${this.prefix}_${key}`);
    } catch (error) {
      console.warn('Failed to delete from localStorage:', error);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(`${this.prefix}_`)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear localStorage cache:', error);
    }
  }
}

// Global localStorage cache instance
export const localStorageCache = new LocalStorageCache('skillswap', 24 * 60 * 60 * 1000); 