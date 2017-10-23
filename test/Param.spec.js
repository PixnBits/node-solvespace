const expect = require('chai').expect;

const Param = require('../lib/Param');

describe('Param', () => {
  describe('constructor', () => {
    it('allows for valid values', () => {
      const p = new Param({
        tag: 1e6,
        value: 6e2,
        known: true,
        free: false,
        notSupported: true,
      });

      expect(p).to.be.instanceOf(Param);
      expect(p).to.have.property('tag', 1e6);
      expect(p).to.have.property('value', 6e2);
      expect(p).to.have.property('known', true);
      expect(p).to.have.property('free', false);
      expect(p).to.not.have.property('notSupported');
    });
    it('ignores wrong types', () => {
      const p = new Param({
        tag: 'youre it!',
        value: 'twelve',
        known: 1,
        free: 0,
      });

      expect(p).to.be.instanceOf(Param);
      expect(p).to.not.have.property('tag');
      expect(p).to.not.have.property('value');
      expect(p).to.not.have.property('known');
      expect(p).to.not.have.property('free');
    });
    it('allows no options, though pointless', () => {
      const p = new Param();

      expect(p).to.be.instanceOf(Param);
    });
  });
});
