// const Expression = require('./Expression');
// but it's a circular dep, load later when needed
// bug in let-and-var/scopes
var Expression; // eslint-disable-line let-and-var/scopes

function Token(opts) {
  this.type = opts.type;

  // circular dep, temp work-around
  // TODO: remove circular dep, maybe move Token into ExpressionParser.js ?
  Expression = Expression || require('./Expression'); // eslint-disable-line global-require

  if (!opts.operator) {
    this.expression = new Expression(opts.value || null);
  } else {
    this.expression = new Expression(opts);
  }
}

module.exports = Token;
