const expect = require('chai').expect;

const Style = require('../lib/Style');

describe('Style', () => {
  it('cnfColor', () => {
    expect(Style.cnfColor('prepreprefix')).to.equal('Style_prepreprefix_Color');
  });
  it('cnfWidth');
  it('cnfTextHeight');
  it('cnfPrefixToName');
  it('createAllDefaultStyles');
  it('createDefaultStyle');
  it('fillDefaultStyle');
  it('freezeDefaultStyles');
  it('loadFactoryDefaults');
  it('assignSelectionToStyle');
  it('createCustomStyle');
  it('rewriteColor');
  it('get');
  it('color');
  it('fillColor');
  it('width');
  it('widthMm');
  it('textHeight');
  it('defaultTextHeight');
  it('stroke');
  it('exportable');
  it('forEntity');
  it('patternType');
  it('stippleScaleMm');
  it('prototype.descriptionString');
  it('prototype.clear');
});
