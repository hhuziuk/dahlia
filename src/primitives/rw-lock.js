const { Mutex } = require("./mutex.js");

class RwLock {
    constructor(readMutexBuffer, writeMutexBuffer, politics = true) {
        this.politics = politics;
        // true is fair
        // false is greedy
        this.reader = 0;
        this.writer = false;

        this.readMutex = new Mutex(readMutexBuffer);
        this.writeMutex = new Mutex(writeMutexBuffer);

        if (politics) {
            this.waitingWriters = 0;
            const readerGateBuffer = new SharedArrayBuffer(4);
            this.readerGate = new Mutex(readerGateBuffer);
        }
    }

    READ_LOCKS = {
        greedy: () => {
            this.readMutex.lock();
            this.reader++;
            if(this.reader === 1){
                this.writeMutex.lock();
            }
            this.readMutex.unlock();
        },

        fair: () => {
            this.readerGate.lock();
            this.readMutex.lock();
            this.reader++;
            if (this.reader === 1) {
                this.writeMutex.lock();
            }
            this.readMutex.unlock();
            this.readerGate.unlock();
        }
    }

    WRITE_LOCKS = {
        greedy: () => {
            this.readMutex.lock();
            if (this.reader > 0) {
                this.readMutex.unlock();
                throw new Error("Cannot acquire write lock while read lock is active");
            }
            this.readMutex.unlock();

            this.writeMutex.lock();
            this.writer = true;
        },

        fair: () => {
            this.readMutex.lock();
            if (this.reader > 0) {
                this.readMutex.unlock();
                throw new Error("Cannot acquire write lock while read lock is active");
            }
            this.readMutex.unlock();

            this.waitingWriters++;

            this.readerGate.lock();
            this.writeMutex.lock();
            this.writer = true;
            this.waitingWriters--;
        }
    }

    get readLock() {
        return this.politics ? this.READ_LOCKS.fair : this.READ_LOCKS.greedy;
    }

    get writeLock() {
        return this.politics ? this.WRITE_LOCKS.fair : this.WRITE_LOCKS.greedy;
    }

    readUnlock() {
        this.readMutex.lock();
        this.reader--;
        if (this.reader === 0) {
            this.writeMutex.unlock();

            if (this.politics && this.waitingWriters > 0) {
                this.readerGate.unlock();
            }
        }
        this.readMutex.unlock();
    }

    writeUnlock() {
        this.writer = false;
        this.writeMutex.unlock();
        if (this.politics) {
            this.readerGate.unlock();
        }
    }
}

module.exports = { RwLock };