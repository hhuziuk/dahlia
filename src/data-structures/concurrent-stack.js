const { RwLock } = require("../primitives/rw-lock");

class ListNode {
    constructor(element) {
        this.element = element;
        this.next = null;
        this.prev = null;
    }
}

class ConcurrentStack {
    #length = 0;
    #head = null;

    constructor() {
        this.readerBuffer = new SharedArrayBuffer(4);
        this.writerBuffer = new SharedArrayBuffer(4);
        this.rwLock = new RwLock(this.readerBuffer, this.writerBuffer, true);
    }

    push(item) {
        const node = new ListNode(item);
        this.rwLock.writeLock();
        try {
            if (this.#head) {
                node.next = this.#head;
                this.#head.prev = node;
            }
            this.#head = node;
            this.#length++;
        } catch (e) {
            throw e;
        } finally {
            this.rwLock.writeUnlock();
        }
    }

    pop() {
        this.rwLock.writeLock();
        try {
            if (this.#length === 0) return null;
            const item = this.#head.element;
            this.#head = this.#head.next;
            if (this.#head) {
                this.#head.prev = null;
            }
            this.#length--;
            return item;
        } catch (e) {
            throw e;
        } finally {
            this.rwLock.writeUnlock();
        }
    }

    peek() {
        this.rwLock.readLock();
        try {
            return this.#length > 0 ? this.#head.element : null;
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

module.exports = { ConcurrentStack };