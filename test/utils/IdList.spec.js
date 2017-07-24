const expect = require('chai').expect;

const IdList = require('../../lib/utils/IdList');

describe('utils', () => {
  describe('IdList', () => {
    describe('add', () => {
      it('will add a new item', () => {
        const list = new IdList();
        list.add('a', 1);
        expect(list.list).to.deep.equal([{ id: 'a', val: 1 }]);
      });
      it('will not overwrite an existing item', () => {
        const list = new IdList();
        list.add('a', 1);
        expect(() => list.add('a', 2)).to.throw('"a" already exists in IdList');
      });
    });
    describe('set', () => {
      it('will add a new item', () => {
        const list = new IdList();
        list.set('a', 1);
        expect(list.list).to.deep.equal([{ id: 'a', val: 1 }]);
      });
      it('will overwrite an existing item', () => {
        const list = new IdList();
        list.set('a', 1);
        list.set('a', 2);
        expect(list.list).to.deep.equal([{ id: 'a', val: 2 }]);
      });
    });
    describe('has', () => {
      it('returns true when the id is in the list', () => {
        const list = new IdList();
        list.add('a', 1);
        expect(list.has('a')).to.equal(true);
      });
      it('returns false when the id is not in the list', () => {
        const list = new IdList();
        list.add('a', 1);
        expect(list.has('b')).to.equal(false);
      });
    });
    describe('get', () => {
      it('returns undefined when the id is not in the list', () => {
        const list = new IdList();
        list.add('b', 1);
        expect(list.get('a')).to.equal(undefined);
      });
      it('returns the stored value when the id is in the list', () => {
        const list = new IdList();
        list.add('a', 1);
        expect(list.get('a')).to.equal(1);
      });
    });
    describe('clear', () => {
      it('removes all entries', () => {
        const list = new IdList();
        list.add('a', 1);
        list.clear();
        expect(list.list).to.deep.equal([]);
      });
    });
    describe('count', () => {
      it('gives us the number of unique ids', () => {
        const list = new IdList();
        list.add('a', 1);
        expect(list.count()).to.equal(1);
      });
    });
  });
});
