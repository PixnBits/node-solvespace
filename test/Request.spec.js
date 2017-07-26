const expect = require('chai').expect;

const Request = require('../lib/Request');

const Param = require('../lib/Param');
const HParam = require('../lib/HParam');
const IdList = require('../lib/utils/IdList');

describe('Request', () => {
  it('addParam', () => {
    const param = new IdList(Param, HParam);
    // hParam...what does `h` stand for?
    // maybe http://www.brising.com/hungarian_c.html
    // "has-a"
    const hp = new HParam(17);
    const ret = Request.addParam(param, hp);
    expect(ret).to.equal(hp);
    expect(param.elem).to.have.property(hp.v);
    expect(param.elem[hp.v]).to.be.instanceOf(Param);
  });
  it('generate');
  it('descriptionString');
  it('indexOfPoint');
  it('clear');
});
