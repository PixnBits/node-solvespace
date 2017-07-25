const expect = require('chai').expect;

const Param = require('../lib/Param');

describe('Param', () => {
  describe('constructor', () => {
    it('allows for valid values', () => {
      const p = new Param({
        tag: 1e6,
        hParam: 'no-idea-what-this-is-or-what-its-used-for',
        val: 6e2,
        known: true,
        free: false,
        substd: 'C-is-different-than-my-world',
        notSupported: true,
      });

      expect(p).to.be.instanceOf(Param);
      expect(p).to.have.property('tag', 1e6);
      expect(p).to.have.property('h', 'no-idea-what-this-is-or-what-its-used-for');
      expect(p).to.have.property('val', 6e2);
      expect(p).to.have.property('known', true);
      expect(p).to.have.property('free', false);
      expect(p).to.have.property('substd', 'C-is-different-than-my-world');
      expect(p).to.not.have.property('notSupported');
    });
    it('ignores wrong types', () => {
      const p = new Param({
        tag: 'youre it!',
        val: 'twelve',
        known: 1,
        free: 0,
      });

      expect(p).to.be.instanceOf(Param);
      expect(p).to.not.have.property('tag');
      expect(p).to.not.have.property('val');
      expect(p).to.not.have.property('known');
      expect(p).to.not.have.property('free');
    });
    it('allows no options, though pointless', () => {
      const p = new Param();

      expect(p).to.be.instanceOf(Param);
    });
  });
  it('clear', () => {
    const p = new Param();
    expect(() => p.clear()).to.not.throw();
    // that's it AFAIK, it's a noop
  });
});
