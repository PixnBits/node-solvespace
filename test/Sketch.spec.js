const expect = require('chai').expect;

const Sketch = require('../lib/Sketch');

describe('Sketch', () => {
  it('constructor', () => {
    const sk = new Sketch();
    expect(sk).to.be.instanceOf(Sketch);
  });
  it('getConstraint');
  it('getEntity');
  it('clear');
  it('calculateEntityBBox');
  it('getRunningMeshGroupFor');
});
