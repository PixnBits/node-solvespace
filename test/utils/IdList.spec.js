const expect = require('chai').expect;

const IdList = require('../../lib/utils/IdList');

describe('utils', () => {
  describe('IdList', () => {
    function H() {
      this.v = undefined;
    }
    function T() {
      this.h = new H();
    }

    describe('constructor', () => {
      it('throws if T is not a constructor', () => {
        expect(() => new IdList(1, 2)).to.throw();
      });
      it('creates an instance', () => {
        const l = new IdList(T, H);
        expect(l).to.be.instanceOf(IdList);
        expect(l).to.have.property('elem');
        // expect(l.elem).to.be.an('Array');
        expect(l.elem).to.be.an('Object');
        expect(l).to.have.property('n', 0);
        expect(l).to.have.property('elemsAllocated', 0);
      });
    });
    it('maximumId', () => {
      const l = new IdList(T, H);
      expect(l.maximumId()).to.equal(0);

      l.addAndAssignId(new T());
      expect(l.maximumId()).to.equal(0);
      l.addAndAssignId(new T());
      expect(l.maximumId()).to.be.greaterThan(0);
      expect(l.maximumId()).to.equal(1);
    });
    it('addAndAssignId', () => {
      const l = new IdList(T, H);

      const h0 = l.addAndAssignId(new T());
      expect(h0.v).to.equal(0);
      const h1 = l.addAndAssignId(new T());
      expect(h1.v).to.equal(1);
    });
    it('reserveMore', () => {
      const l = new IdList(T, H);

      // expect(l.elem.length).to.equal(0);
      expect(l.n).to.equal(0);
      expect(l.elemsAllocated).to.equal(0);

      l.reserveMore(5);
      // expect(l.elem.length).to.equal(5);
      expect(l.n).to.equal(0);
      expect(l.elemsAllocated).to.equal(5);
    });
    it('add', () => {
      const l = new IdList(T, H);

      // expect(l.elem.length).to.equal(0);
      expect(l.n).to.equal(0);
      expect(l.elemsAllocated).to.equal(0);

      const t = new T();
      t.h.v = 12;
      l.add(t);
      // expect(l.elem.length).to.equal(64);
      expect(l.n).to.equal(12);
      expect(l.elemsAllocated).to.equal(64);
    });
    it('findById', () => {
      const l = new IdList(T, H);
      const t1 = new T();

      expect(() => l.findById(t1.h)).to.throw();
      t1.h.v = 10;
      expect(() => l.findById(t1.h)).to.throw();

      l.addAndAssignId(t1);
      const t2 = new T();
      l.addAndAssignId(t2);
      const t3 = new T();
      l.addAndAssignId(t3);

      const tFound = l.findById(t1.h);
      expect(tFound).to.equal(t1);
    });
    it('indexOf', () => {
      const l = new IdList(T, H);
      const t1 = new T();
      const t2 = new T();
      t2.h.v = 10;
      const t3 = new T();

      expect(() => l.indexOf(t1.h)).to.throw();
      expect(l.indexOf(t2.h)).to.equal(-1);

      l.addAndAssignId(t1);
      l.add(t2);
      l.addAndAssignId(t3);

      expect(l.indexOf(t1.h)).to.equal(0);
      expect(l.indexOf(t2.h)).to.equal(10);
      expect(l.indexOf(t3.h)).to.equal(11);
    });
    it('findByIdNoOops', () => {
      const l = new IdList(T, H);
      const t1 = new T();

      expect(l.findByIdNoOops(t1.h)).to.equal(null);
      t1.h.v = 10;
      expect(l.findByIdNoOops(t1.h)).to.equal(null);

      l.addAndAssignId(t1);
      const t2 = new T();
      l.addAndAssignId(t2);
      const t3 = new T();
      l.addAndAssignId(t3);

      const tFound = l.findById(t1.h);
      expect(tFound).to.equal(t1);
    });
    it('first', () => {
      const l = new IdList(T, H);

      expect(l.first()).to.equal(null);

      const t1 = new T();
      l.addAndAssignId(t1);
      l.addAndAssignId(new T());
      l.addAndAssignId(new T());
      expect(l.first()).to.equal(t1);
    });
    it('nextAfter', () => {
      const l = new IdList(T, H);
      const t1 = new T();
      const t2 = new T();
      const t3 = new T();

      expect(l.nextAfter(t1)).to.equal(null);

      l.addAndAssignId(t1);
      expect(l.nextAfter(t1)).to.equal(null);

      l.addAndAssignId(t2);
      t3.h.v = 12;
      l.add(t3);
      expect(l.nextAfter(t1)).to.equal(t2);
      expect(l.nextAfter(t2)).to.equal(t3);
    });
    it('begin', () => {
      const l = new IdList(T, H);

      expect(l.begin()).to.equal(undefined);

      const t1 = new T();
      l.addAndAssignId(t1);
      l.addAndAssignId(new T());
      l.addAndAssignId(new T());
      expect(l.begin()).to.equal(t1);
    });
    it('end', () => {
      const l = new IdList(T, H);

      expect(l.end()).to.equal(undefined);

      l.addAndAssignId(new T());
      l.addAndAssignId(new T());
      const t3 = new T();
      l.addAndAssignId(t3);
      expect(l.end()).to.equal(t3);
    });
    it('clearTags', () => {
      const l = new IdList(T, H);
      const t1 = new T();
      l.addAndAssignId(t1);
      const t2 = new T();
      l.addAndAssignId(t2);
      const t3 = new T();
      t3.h.v = 5;
      l.add(t3);

      l.clearTags();
      expect(t1.tag).to.equal(0);
      expect(t2.tag).to.equal(0);
      expect(t3.tag).to.equal(0);
    });
    it('tag', () => {
      const l = new IdList(T, H);
      const t1 = new T();
      l.addAndAssignId(t1);
      const t2 = new T();
      l.addAndAssignId(t2);
      const t3 = new T();
      t3.h.v = 5;
      l.add(t3);

      l.tag(t2.h, 1337);
      expect(t1.tag).to.equal(undefined);
      expect(t2.tag).to.equal(1337);
      expect(t3.tag).to.equal(undefined);
    });
    it('removeTagged', () => {
      const l = new IdList(T, H);
      const t1 = new T();
      l.addAndAssignId(t1);
      const t2 = new T();
      l.addAndAssignId(t2);
      const t3 = new T();
      t3.h.v = 5;
      l.add(t3);

      l.tag(t2.h, 1337);
      l.removeTagged();
      expect(l.elem).to.have.property(t1.h.v, t1);
      expect(l.elem).to.have.property(t3.h.v, t3);
      expect(l.elem).to.not.have.property(t2.h.v);

      l.tag(t3.h, 7331);
      l.removeTagged();
      expect(l.elem).to.have.property(t1.h.v, t1);
      expect(l.elem).to.not.have.property(t3.h.v);

      l.tag(t1.h, 7331);
      l.removeTagged();
      expect(l.elem).to.not.have.property(t1.h.v);
    });
    it('removeById', () => {
      const l = new IdList(T, H);

      const t1 = new T();
      l.addAndAssignId(t1);
      const t2 = new T();
      l.addAndAssignId(t2);
      const t3 = new T();
      t3.h.v = 5;
      l.add(t3);

      l.removeById(t2.h);
      expect(l.elem).to.have.property(t1.h.v, t1);
      expect(l.elem).to.have.property(t3.h.v, t3);
      expect(l.elem).to.not.have.property(t2.h.v);

      l.tag(t1.h, 1337);
      l.removeById(t3.h);
      expect(l.elem).to.have.property(t1.h.v, t1);
      expect(l.elem).to.not.have.property(t3.h.v);
    });
    it('moveSelfInto', () => {
      function TT() {}
      function HH() {}

      const lf = new IdList(T, H);

      const t1 = new T();
      lf.addAndAssignId(t1);
      const t2 = new T();
      lf.addAndAssignId(t2);

      const lIncompatible = new IdList(TT, HH);
      expect(() => lf.moveSelfInto(lIncompatible)).to.throw();

      const lt = new IdList(T, H);
      lf.moveSelfInto(lt);
      expect(lf.elem).to.not.have.property(t1.h.v);
      expect(lf.elem).to.not.have.property(t2.h.v);
      expect(lf.n).to.equal(0);
      expect(lf.elemsAllocated).to.equal(0);
      expect(lt.elem).to.have.property(t1.h.v, t1);
      expect(lt.elem).to.have.property(t2.h.v, t2);
      expect(lt.n).to.equal(1);
      expect(lt.elemsAllocated).to.equal(64);
    });
    it('deepCopyInto');
    it('clear', () => {
      var t2ClearCalled = false;
      const l = new IdList(T, H);

      const t1 = new T();
      l.addAndAssignId(t1);
      const t2 = new T();
      t2.clear = () => { t2ClearCalled = true; };
      l.addAndAssignId(t2);
      const t3 = new T();
      t3.h.v = 5;
      l.add(t3);

      l.clear();
      expect(l.elem).to.not.have.property(t1.h.v);
      expect(l.elem).to.not.have.property(t2.h.v);
      expect(t2ClearCalled).to.equal(true);
      expect(l.elem).to.not.have.property(t3.h.v);
    });
  });
});
