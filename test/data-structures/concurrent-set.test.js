const { expect } = require("chai");
const {
  ConcurrentSet,
} = require("../../src/data-structures/concurrent-set.js");

describe("ConcurrentSet", function () {
  let set;

  beforeEach(() => {
    set = new ConcurrentSet();
  });

  describe("add()", function () {
    it("should add new elements", () => {
      set.add(1);
      set.add(2);
      expect(set.size).to.equal(2);
      expect(set.has(1)).to.be.true;
      expect(set.has(2)).to.be.true;
    });

    it("should not add duplicates", () => {
      set.add(1);
      set.add(1);
      expect(set.size).to.equal(1);
    });
  });

  describe("has()", function () {
    it("should return true for existing values", () => {
      set.add("hello");
      expect(set.has("hello")).to.be.true;
    });

    it("should return false for missing values", () => {
      expect(set.has("world")).to.be.false;
    });
  });

  describe("delete()", function () {
    it("should delete existing values and return true", () => {
      set.add(42);
      const result = set.delete(42);
      expect(result).to.be.true;
      expect(set.has(42)).to.be.false;
    });

    it("should return false if value does not exist", () => {
      const result = set.delete("nope");
      expect(result).to.be.false;
    });
  });

  describe("clear()", function () {
    it("should remove all elements", () => {
      set.add(1);
      set.add(2);
      set.clear();
      expect(set.size).to.equal(0);
      expect(set.has(1)).to.be.false;
      expect(set.has(2)).to.be.false;
    });
  });

  describe("size", function () {
    it("should return correct size", () => {
      expect(set.size).to.equal(0);
      set.add(1);
      expect(set.size).to.equal(1);
    });
  });

  describe("[Symbol.iterator]()", function () {
    it("should iterate through all values", () => {
      const values = [1, 2, 3];
      values.forEach((v) => set.add(v));
      const result = [...set];
      expect(result).to.have.members(values);
    });
  });

  describe("values()", function () {
    it("should yield values correctly", () => {
      set.add("a");
      set.add("b");
      const vals = Array.from(set.values());
      expect(vals).to.have.members(["a", "b"]);
    });
  });
});
