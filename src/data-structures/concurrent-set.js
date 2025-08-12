const { RwLock } = require("../primitives/rw-lock");

class ConcurrentSet {
  #map;

  constructor() {
    this.#map = new Map();

    this.readerBuffer = new SharedArrayBuffer(4);
    this.writerBuffer = new SharedArrayBuffer(4);
    this.rwLock = new RwLock(this.readerBuffer, this.writerBuffer, true);
  }

  add(value) {
    this.rwLock.writeLock();
    try {
      if (!this.#map.has(value)) {
        this.#map.set(value, true);
      }
      return this;
    } finally {
      this.rwLock.writeUnlock();
    }
  }

  clear() {
    this.rwLock.writeLock();
    try {
      this.#map.clear();
    } finally {
      this.rwLock.writeUnlock();
    }
  }

  delete(value) {
    this.rwLock.writeLock();
    try {
      return this.#map.delete(value);
    } finally {
      this.rwLock.writeUnlock();
    }
  }

  has(value) {
    this.rwLock.readLock();
    try {
      return this.#map.has(value);
    } finally {
      this.rwLock.readUnlock();
    }
  }

  get size() {
    this.rwLock.readLock();
    try {
      return this.#map.size;
    } finally {
      this.rwLock.readUnlock();
    }
  }

  *values() {
    this.rwLock.readLock();
    try {
      yield* this.#map.keys();
    } finally {
      this.rwLock.readUnlock();
    }
  }

  [Symbol.iterator]() {
    return this.values();
  }
}

module.exports = { ConcurrentSet };
