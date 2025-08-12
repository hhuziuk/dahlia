const { RwLock } = require("../primitives/rw-lock");

class ListNode {
  constructor(element) {
    this.element = element;
    this.next = null;
    this.prev = null;
  }
}

class ConcurrentDeque {
  #length = 0;
  #head = null;
  #tail = null;

  constructor() {
    this.readerBuffer = new SharedArrayBuffer(4);
    this.writerBuffer = new SharedArrayBuffer(4);
    this.rwLock = new RwLock(this.readerBuffer, this.writerBuffer, true);
  }

  enqueueFront(item) {
    const node = new ListNode(item);
    this.rwLock.writeLock();
    try {
      if (this.#head) {
        node.next = this.#head;
        this.#head.prev = node;
      } else {
        this.#tail = node;
      }
      this.#head = node;
      this.#length++;
    } catch (e) {
      throw e;
    } finally {
      this.rwLock.writeUnlock();
    }
  }

  enqueueBack(item) {
    const node = new ListNode(item);
    this.rwLock.writeLock();
    try {
      if (this.#tail) {
        node.prev = this.#tail;
        this.#tail.next = node;
      } else {
        this.#head = node;
      }
      this.#tail = node;
      this.#length++;
    } catch (e) {
      throw e;
    } finally {
      this.rwLock.writeUnlock();
    }
  }

  dequeueFront() {
    this.rwLock.writeLock();
    try {
      if (this.#length === 0) return null;
      const item = this.#head.element;
      this.#head = this.#head.next;
      if (this.#head) {
        this.#head.prev = null;
      } else {
        this.#tail = null;
      }
      this.#length--;
      return item;
    } catch (e) {
      throw e;
    } finally {
      this.rwLock.writeUnlock();
    }
  }

  dequeueBack() {
    this.rwLock.writeLock();
    try {
      if (this.#length === 0) return null;
      const item = this.#tail.element;
      this.#tail = this.#tail.prev;
      if (this.#tail) {
        this.#tail.next = null;
      } else {
        this.#head = null;
      }
      this.#length--;
      return item;
    } catch (e) {
      throw e;
    } finally {
      this.rwLock.writeUnlock();
    }
  }

  peekFront() {
    this.rwLock.readLock();
    try {
      return this.#length > 0 ? this.#head.element : null;
    } catch (e) {
      throw e;
    } finally {
      this.rwLock.readUnlock();
    }
  }

  peekBack() {
    this.rwLock.readLock();
    try {
      return this.#length > 0 ? this.#tail.element : null;
    } catch (e) {
      throw e;
    } finally {
      this.rwLock.readUnlock();
    }
  }

  get size() {
    this.rwLock.readLock();
    try {
      return this.#length;
    } catch (e) {
      throw e;
    } finally {
      this.rwLock.readUnlock();
    }
  }

  isEmpty() {
    this.rwLock.readLock();
    try {
      return this.#length === 0;
    } catch (e) {
      throw e;
    } finally {
      this.rwLock.readUnlock();
    }
  }
}

module.exports = { ConcurrentDeque };
