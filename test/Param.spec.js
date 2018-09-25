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

      expect(p).toBeInstanceOf(Param);
      expect(p).toHaveProperty('tag', 1e6);
      expect(p).toHaveProperty('value', 6e2);
      expect(p).toHaveProperty('known', true);
      expect(p).toHaveProperty('free', false);
      expect(p).not.toHaveProperty('notSupported');
    });

    it('ignores wrong types', () => {
      const p = new Param({
        tag: 'youre it!',
        value: 'twelve',
        known: 1,
        free: 0,
      });

      expect(p).toBeInstanceOf(Param);
      expect(p).not.toHaveProperty('tag');
      expect(p).not.toHaveProperty('value');
      expect(p).not.toHaveProperty('known');
      expect(p).not.toHaveProperty('free');
    });

    it('allows no options, though pointless', () => {
      const p = new Param();
      expect(p).toBeInstanceOf(Param);
    });
  });
});
