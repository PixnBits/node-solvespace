const expect = require('chai').expect;

const ExpressionParser = require('../../lib/ExpressionParser');
const Token = require('../../lib/Token');

describe('ExpressionParser', () => {
  it('reads', () => {
    const ep = new ExpressionParser('abc');
    expect(ep.readChar()).to.equal('a');
    expect(ep.readChar()).to.equal('b');
  });

  it('peeks', () => {
    const ep = new ExpressionParser('abc');
    expect(ep.peekChar()).to.equal('a');
    expect(ep.peekChar()).to.equal('a');
  });

  it('skipSpace', () => {
    const ep = new ExpressionParser('   a + 2  ');
    expect(ep.inputPosition).to.equal(0);
    ep.skipSpace();
    expect(ep.inputPosition).to.equal(3);
    ep.inputPosition += 1;
    ep.skipSpace();
    expect(ep.inputPosition).to.equal(5);
  });

  describe('readWord', () => {
    it('alpha', () => {
      const ep = new ExpressionParser('wordToRead + 12');
      expect(ep.readWord()).to.equal('wordToRead');
    });
    it('alphanum', () => {
      const ep = new ExpressionParser('wordToRead1 * 3');
      expect(ep.readWord()).to.equal('wordToRead1');
    });
  });

  describe('readNumber', () => {
    describe('integer', () => {
      [
        // http://www.crockford.com/javascript/encyclopedia/#number literal
        '.01024e5',
        '1.024e+3',
        '10.24E2',
        '102.4E+1',
        '1024.e0',
        '1024.00',
        '1024',
        '10240e-1',

        // hexadecimal
        '0x400',
        '0X400',
      ]
        .forEach((s) => {
          it(s, () => {
            const ep = new ExpressionParser(s);
            expect(ep.readNumber()).to.equal(1024);
          });
        });

      it('maintains the right input position', () => {
        const ep = new ExpressionParser('1 + 2');
        const d = ep.readNumber();
        expect(d).to.equal(1);
        expect(ep.input).to.equal('1 + 2');
        expect(ep.inputPosition).to.equal(1);
      });
    });
    describe('decimal', () => {
      it('leading 0', () => {
        const ep = new ExpressionParser('0.12345');
        expect(ep.readNumber()).to.equal(0.12345);
      });
      it('leading dot', () => {
        const ep = new ExpressionParser('.12345');
        expect(ep.readNumber()).to.equal(0.12345);
      });
    });
  });

  describe('precedence', () => {
    it('unary', () => {
      const t = new Token({ type: 'unary', operator: 'sqrt' });
      expect(ExpressionParser.precedence(t)).to.equal(30);
    });
    it('times', () => {
      const t = new Token({ type: 'binary', operator: 'times' });
      expect(ExpressionParser.precedence(t)).to.equal(20);
    });
    it('divide', () => {
      const t = new Token({ type: 'binary', operator: 'divide' });
      expect(ExpressionParser.precedence(t)).to.equal(20);
    });
    it('plus', () => {
      const t = new Token({ type: 'binary', operator: 'plus' });
      expect(ExpressionParser.precedence(t)).to.equal(10);
    });
    it('minus', () => {
      const t = new Token({ type: 'binary', operator: 'minus' });
      expect(ExpressionParser.precedence(t)).to.equal(10);
    });
    it('operand', () => {
      const t = new Token({ type: 'operand', operator: 'constant', value: Math.PI });
      expect(ExpressionParser.precedence(t)).to.equal(0);
    });
    it('throws on unexpected token', () => {
      const t = new Token({ type: 'unexpected' });
      expect(() => ExpressionParser.precedence(t)).to.throw('Unexpected token type: "unexpected"');
    });
    it('throws on unexpected operator', () => {
      const t = new Token({ type: 'binary', operator: 'Cavity Sam' });
      expect(() => ExpressionParser.precedence(t)).to.throw('Unexpected operator: "Cavity Sam"');
    });
  });

  describe('lex', () => {
    it('variables', () => {
      const token = (new ExpressionParser('VarName')).lex();
      expect(token).to.have.property('type', 'operand');
      expect(token).to.have.property('expression');
      expect(token.expression).to.have.property('operator', 'variable');
      // TODO: but the variable name is lost?
    });

    describe('functions', () => {
      it('sqrt', () => {
        const token = (new ExpressionParser('sqrt(9)')).lex();
        expect(token).to.have.property('type', 'unary');
        expect(token).to.have.property('expression');
        expect(token.expression).to.have.property('operator', 'sqrt');
      });
      it('square', () => {
        const token = (new ExpressionParser('square(3)')).lex();
        expect(token).to.have.property('type', 'unary');
        expect(token).to.have.property('expression');
        expect(token.expression).to.have.property('operator', 'square');
      });
      it('sin', () => {
        const token = (new ExpressionParser('sin(90)')).lex();
        expect(token).to.have.property('type', 'unary');
        expect(token).to.have.property('expression');
        expect(token.expression).to.have.property('operator', 'sin');
      });
      it('cos', () => {
        const token = (new ExpressionParser('cos(90)')).lex();
        expect(token).to.have.property('type', 'unary');
        expect(token).to.have.property('expression');
        expect(token.expression).to.have.property('operator', 'cos');
      });
      it('asin', () => {
        const token = (new ExpressionParser('asin(1)')).lex();
        expect(token).to.have.property('type', 'unary');
        expect(token).to.have.property('expression');
        expect(token.expression).to.have.property('operator', 'asin');
      });
      it('acos', () => {
        const token = (new ExpressionParser('acos(1)')).lex();
        expect(token).to.have.property('type', 'unary');
        expect(token).to.have.property('expression');
        expect(token.expression).to.have.property('operator', 'acos');
      });

      it('pi', () => {
        const token = (new ExpressionParser('pi * r^2')).lex();
        expect(token).to.have.property('type', 'operand');
        expect(token).to.have.property('expression');
        expect(token.expression).to.have.property('operator', 'constant');
        expect(token.expression).to.have.property('value', Math.PI);
      });
    });

    describe('numbers', () => {
      it('integer', () => {
        const integerToken = (new ExpressionParser('42')).lex();
        expect(integerToken).to.have.property('type', 'operand');
        expect(integerToken).to.have.property('expression');
        expect(integerToken.expression).to.have.property('operator', 'constant');
        expect(integerToken.expression).to.have.property('value', 42);
      });
      it('decimal', () => {
        const decimalToken = (new ExpressionParser('1.234')).lex();
        expect(decimalToken).to.have.property('type', 'operand');
        expect(decimalToken).to.have.property('expression');
        expect(decimalToken.expression).to.have.property('operator', 'constant');
        expect(decimalToken.expression).to.have.property('value', 1.234);
      });
    });

    describe('punctuation', () => {
      it('+', () => {
        const token = (new ExpressionParser('+')).lex();
        expect(token).to.have.property('type', 'binary');
        expect(token).to.have.property('expression');
        expect(token.expression).to.have.property('operator', 'plus');
      });
      it('-', () => {
        const token = (new ExpressionParser('-')).lex();
        expect(token).to.have.property('type', 'binary');
        expect(token).to.have.property('expression');
        expect(token.expression).to.have.property('operator', 'minus');
      });
      it('*', () => {
        const token = (new ExpressionParser('*')).lex();
        expect(token).to.have.property('type', 'binary');
        expect(token).to.have.property('expression');
        expect(token.expression).to.have.property('operator', 'times');
      });
      it('/', () => {
        const token = (new ExpressionParser('/')).lex();
        expect(token).to.have.property('type', 'binary');
        expect(token).to.have.property('expression');
        expect(token.expression).to.have.property('operator', 'divide');
      });

      it('(', () => {
        const token = (new ExpressionParser('(')).lex();
        expect(token).to.have.property('type', 'parenthesis-left');
        expect(token).to.have.property('expression');
        expect(token.expression).to.not.have.property('operator');
      });
      it(')', () => {
        const token = (new ExpressionParser(')')).lex();
        expect(token).to.have.property('type', 'parenthesis-right');
        expect(token).to.have.property('expression');
        expect(token.expression).to.not.have.property('operator');
      });
    });

    it('ends', () => {
      const token = (new ExpressionParser('')).lex();
      expect(token).to.have.property('type', 'end');
    });
  });

  describe('popOperand', () => {
    it('throws if the stack is empty', () => {
      const expr = new ExpressionParser();
      expect(expr.stack).to.be.empty;
      expect(() => expr.popOperand()).to.throw('Expected an operand');
    });
    it('throws if the last token on the stack is not an operand', () => {
      const expr = new ExpressionParser();
      expr.stack.push(new Token({ type: 'unary', operator: 'sqrt' }));
      expect(() => expr.popOperand()).to.throw('Expected an operand');
      expect(expr.stack).to.have.length(1);
    });
    it('returns the last token on the stack', () => {
      const expr = new ExpressionParser();
      const token = new Token({ type: 'operand', operator: 'constant', value: Math.PI });
      expr.stack.push(token);
      expect(expr.popOperand()).to.equal(token);
      expect(expr.stack).to.have.length(0);
    });
  });

  describe('popOperator', () => {
    it('throws if the stack is empty', () => {
      const expr = new ExpressionParser();
      expect(expr.stack).to.be.empty;
      expect(() => expr.popOperator()).to.throw('Expected an operator');
    });
    it('throws if the last token on the stack is not a unary or binary', () => {
      const expr = new ExpressionParser();
      const token = new Token({ type: 'operand', operator: 'constant', value: Math.PI });
      expr.stack.push(token);
      expect(() => expr.popOperator()).to.throw('Expected an operator');
      expect(expr.stack).to.have.length(1);
    });
    it('returns the last token on the stack', () => {
      const expr = new ExpressionParser();
      const token = new Token({ type: 'unary', operator: 'sqrt' });
      expr.stack.push(token);
      expect(expr.popOperator()).to.equal(token);
      expect(expr.stack).to.have.length(0);
    });
  });

  describe('reduce', () => {
    it('throws if no operand', () => {
      const expr = new ExpressionParser();
      expr.stack.unshift(new Token({ type: 'unary', operator: 'sqrt' }));
      expect(() => expr.reduce()).to.throw('Expected an operand');
    });
    it('throws if no operator after operand', () => {
      const expr = new ExpressionParser();
      expr.stack.unshift(new Token({ type: 'operand', operator: 'constant', value: Math.PI }));
      expr.stack.unshift(new Token({ type: 'operand', operator: 'constant', value: Math.PI }));
      expect(() => expr.reduce()).to.throw('Expected an operator');
    });
    describe('binary operand', () => {
      it("throws if there's not another operand", () => {
        const expr = new ExpressionParser();
        expr.stack.unshift(new Token({ type: 'operand', operator: 'constant', value: Math.PI }));
        expr.stack.unshift(new Token({ type: 'binary', operator: 'plus' }));
        expr.stack.unshift(new Token({ type: 'binary', operator: 'plus' }));
        expect(expr.stack).to.have.length(3);
        expect(() => expr.reduce()).to.throw('Expected an operand');
      });
      it('combines the two operands and operator, adds the combination to the end of the stack, and returns true', () => {
        const expr = new ExpressionParser();
        expr.stack.unshift(new Token({ type: 'operand', operator: 'constant', value: 2 }));
        expr.stack.unshift(new Token({ type: 'binary', operator: 'plus' }));
        expr.stack.unshift(new Token({ type: 'operand', operator: 'constant', value: 1 }));
        expect(expr.stack).to.have.length(3);
        expect(expr.reduce()).to.equal(true);
        expect(expr.stack).to.have.length(1);
        expect(expr.stack).to.have.length(1);
        const token = expr.stack[0];
        expect(token).to.have.property('type', 'operand');
        expect(token).to.have.property('expression');
        expect(token.expression).to.have.property('operator', 'plus');
        expect(token.expression).to.have.property('a');
        expect(token.expression.a).to.have.property('operator', 'constant');
        expect(token.expression.a).to.have.property('value', 1);
        expect(token.expression).to.have.property('b');
        expect(token.expression.b).to.have.property('operator', 'constant');
        expect(token.expression.b).to.have.property('value', 2);
      });
    });
    describe('unary operand', () => {
      it('adds a negates expression to the stack', () => {
        const expr = new ExpressionParser();
        expect(expr.stack).to.have.length(0);
        expr.stack.unshift(new Token({ type: 'operand', operator: 'constant', value: 2 }));
        expr.stack.unshift(new Token({ type: 'unary', operator: 'negate' }));
        expect(expr.stack).to.have.length(2);
        expect(expr.reduce()).to.equal(true);
        expect(expr.stack).to.have.length(1);
        const token = expr.stack[0];
        expect(token).to.have.property('type', 'operand');
        expect(token).to.have.property('expression');
        expect(token.expression).to.have.property('operator', 'negate');
        expect(token.expression).to.have.property('a');
        expect(token.expression.a).to.have.property('operator', 'constant');
        expect(token.expression.a).to.have.property('value', 2);
        expect(token.expression).to.have.property('b', undefined);
      });
      it('adds a sqrt expression to the stack');
      it('adds a square expression to the stack');
      it('adds a sin expression to the stack');
      it('adds a cos expression to the stack');
      it('adds a asin expression to the stack');
      it('adds a acos expression to the stack');
      it('throws on unexpected unary', () => {
        const expr = new ExpressionParser();
        expr.stack.unshift(new Token({ type: 'operand', operator: 'constant', value: 2 }));
        expr.stack.unshift(new Token({ type: 'unary', operator: 'unknown' }));
        expect(expr.stack).to.have.length(2);
        expect(() => expr.reduce()).to.throw('Unexpected unary operator "unknown"');
      });
    });
    it('returns false if operator is not binary or unary');
  });
});
