const { expect } = require("chai");
const { RwLock } = require("../../../src/primitives/rw-lock.js");

describe("RwLock", function () {
  let rwLock;

  beforeEach(function () {
    const readBuffer = new SharedArrayBuffer(4);
    const writeBuffer = new SharedArrayBuffer(4);
    rwLock = new RwLock(readBuffer, writeBuffer, true);
  });

  it("should acquire and release a read lock correctly", function () {
    rwLock.readLock();
    expect(rwLock.reader).to.equal(1);
    rwLock.readUnlock();
    expect(rwLock.reader).to.equal(0);
  });

  it("should acquire and release a write lock correctly", function () {
    rwLock.writeLock();
    expect(rwLock.writer).to.be.true;
    rwLock.writeUnlock();
    expect(rwLock.writer).to.be.false;
  });

  it("should prevent write lock when read lock is active", function () {
    rwLock.readLock();
    expect(() => rwLock.writeLock()).to.throw();
    rwLock.readUnlock();
  });

  it("should allow multiple readers but block writers", function () {
    rwLock.readLock();
    rwLock.readLock();
    expect(rwLock.reader).to.equal(2);
    expect(() => rwLock.writeLock()).to.throw();
    rwLock.readUnlock();
    rwLock.readUnlock();
  });

  it("should allow a writer when there are no readers", function () {
    rwLock.writeLock();
    expect(rwLock.writer).to.be.true;
    rwLock.writeUnlock();
    expect(rwLock.writer).to.be.false;
  });
});
