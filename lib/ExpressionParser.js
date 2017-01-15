const isNumber = require('is-number');
const isWhitespace = require('is-whitespace-character');
const isUpperCase = require('is-upper-case');
const isAlphabetical = require('is-alphabetical');
const isPunctuation = require('is-punctuation');

var Expression;
const Token = require('./Token');

function importExpression() {
  // circular dep, temp work-around
  // TODO: remove circular dep, maybe move Token into ExpressionParser.js ?
  Expression = Expression || require('./Expression'); // eslint-disable-line global-require
}

function isNumeric(str) {
  return isNumber(parseFloat(str, 10));
}

function ExpressionParser(input) {
  this.input = input;
  this.inputPosition = 0;
  this.stack = [];
}

ExpressionParser.prototype.readChar = function readChar() {
  const { input, inputPosition } = this;
  const char = input[inputPosition];
  this.inputPosition += 1;
  return char;
};

ExpressionParser.prototype.peekChar = function peekChar() {
  const { input, inputPosition } = this;
  return input[inputPosition];
};

ExpressionParser.prototype.skipSpace = function skipSpace() {
  var c = this.peekChar();
  while (c) {
    if (!isWhitespace(c)) {
      break;
    }
    this.readChar();
    c = this.peekChar();
  }
};

ExpressionParser.prototype.readWord = function readWord() {
  var wordRead = '';
  var peekChar = this.peekChar();
  while (peekChar) {
    if (!(isAlphabetical(peekChar) || isNumber(parseInt(peekChar, 10)))) {
      break;
    }
    wordRead += this.readChar();
    peekChar = this.peekChar();
  }
  return wordRead;
};

const DECIMAL_NUMBER_REGEXP = /^(\+|-)?\d*(\.\d+)?(e(\+|-)?\d*(\.\d+)?)?/i;
const HEXADECIMAL_NUMBER_REGEXP = /^0\x\d+/i;
ExpressionParser.prototype.readNumber = function readNumber() {
  const inputSegment = this.input.substr(this.inputPosition);

  const hexadecimalMatch = HEXADECIMAL_NUMBER_REGEXP.exec(inputSegment);
  if (hexadecimalMatch) {
    this.inputPosition += hexadecimalMatch[0].length;
    return parseInt(hexadecimalMatch[0], 16);
  }

  const decimalMatch = DECIMAL_NUMBER_REGEXP.exec(inputSegment);
  if (decimalMatch) {
    this.inputPosition += decimalMatch[0].length;
    return parseFloat(decimalMatch[0], 10);
  }

  throw new Error('unable to read number');
};

ExpressionParser.prototype.lex = function lex() {
  var token;

  this.skipSpace();
  const peekChar = this.peekChar();
  // console.log(`lex, peekChar: >${peekChar}< (inputPosition ${this.inputPosition})`);
  if (isUpperCase(peekChar) && !isNumeric(peekChar) && !isPunctuation(peekChar)) {
    const n = this.readWord();
    token = new Token({ type: 'operand', operator: 'variable' });
    console.warn(`but what do we do with n ("${n}")?`);
  } else if (isAlphabetical(peekChar)) {
    const s = this.readWord();
    switch (s) {
      case 'sqrt':
      case 'square':
      case 'sin':
      case 'cos':
      case 'asin':
      case 'acos':
        token = new Token({ type: 'unary', operator: s });
        break;
      case 'pi':
        token = new Token({ type: 'operand', operator: 'constant', value: Math.PI });
        break;
      default:
        throw new Error(`"${s}" is not a valid variable, function or constant`);

    }
  } else if (isNumeric(peekChar) || peekChar === '.') {
    const d = this.readNumber();
    // console.log(`lex, readNumber as >${d}<, inputPosition is now >${this.inputPosition}<`);
    token = new Token({ type: 'operand', operator: 'constant', value: d });
  } else if (isPunctuation(peekChar)) {
    this.readChar();
    switch (peekChar) {
      case '+':
        token = new Token({ type: 'binary', operator: 'plus' });
        break;
      case '-':
        token = new Token({ type: 'binary', operator: 'minus' });
        break;
      case '*':
        token = new Token({ type: 'binary', operator: 'times' });
        break;
      case '/':
        token = new Token({ type: 'binary', operator: 'divide' });
        break;
      case '(':
        token = new Token({ type: 'parenthesis-left' });
        break;
      case ')':
        token = new Token({ type: 'parenthesis-right' });
        break;
      default:
        throw new Error(`"${peekChar}" is not a valid operator`);
    }
  } else if (peekChar === undefined) {
    token = new Token({ type: 'end' });
  } else {
    throw new Error(`Unexpected character "${peekChar}"`);
  }

  // console.log(`lex, inputPosition: ${this.inputPosition} ("${this.input}")`);
  // console.log('lex, token', token);
  return token;
};

ExpressionParser.prototype.popOperand = function popOperand() {
  const { stack } = this;
  const token = stack[stack.length - 1];
  if (!token || token.type !== 'operand') {
    throw new Error('Expected an operand');
  }

  stack.pop();
  return token;
};

ExpressionParser.prototype.popOperator = function popOperator() {
  const { stack } = this;
  const token = stack[stack.length - 1];
  const tokenType = token && token.type;
  if (!token || (tokenType !== 'unary' && tokenType !== 'binary')) {
    throw new Error('Expected an operator');
  }

  stack.pop();
  return token;
};

ExpressionParser.prototype.reduce = function reduce() {
  const { stack } = this;
  var a;
  var b;
  var operator;
  try {
    a = this.popOperand();
    operator = this.popOperator();
  } catch (e) {
    return false;
  }

  const reduced = new Token({ type: 'operand' });
  // console.log('reduce: operator.type', operator.type);
  switch (operator.type) {
    case 'binary':
      try {
        b = this.popOperand();
      } catch (e) {
        return false;
      }
      reduced.expression = b.expression.anyOp(operator.expression.operator, a.expression);
      break;
    case 'unary':
      switch (operator.expression.operator) {
        case 'negate':
          reduced.expression = a.expression.negate();
          break;
        case 'sqrt':
          reduced.expression = a.expression.sqrt();
          break;
        case 'square':
          reduced.expression = a.expression.times(a.expression);
          break;
        case 'sin':
          importExpression();
          reduced.expression = a.expression.times(new Expression(Math.PI / 180)).sin();
          break;
        case 'cos':
          importExpression();
          reduced.expression = a.expression.times(new Expression(Math.PI / 180)).cos();
          break;
        case 'asin':
          importExpression();
          reduced.expression = a.expression.asin().times(new Expression(180 / Math.PI));
          break;
        case 'acos':
          importExpression();
          reduced.expression = a.expression.acos().times(new Expression(180 / Math.PI));
          break;
        default:
          throw new Error(`Unexpected unary operator "${operator.expression.operator}"`);
      }
      break;
    default:
      throw new Error('Unexpected operator');
  }

  stack.push(reduced);
  return true;
};

ExpressionParser.prototype.parse = function parse(reduceUntil = 0) {
  var lastInputPosition;
  const { stack } = this;

  while (lastInputPosition !== this.inputPosition) {
    lastInputPosition = this.inputPosition;
    const token = this.lex();
    // console.log('lex token:', token);
    // console.log('lex token type:', token.type);
    switch (token.type) {
      case 'end':
      case 'parenthesis-right':
        // console.log(`end or ), reduceUntil: ${reduceUntil}`);
        while (stack.length > 1 + reduceUntil) {
          if (!this.reduce()) {
            return false;
          }
        }
        // console.log('end or ), token type', token.type);
        if (token.type === 'parenthesis-right') {
          stack.push(token);
        }
        // TODO: throw if the stack has > 1 element?
        if (stack.length > 1) {
          console.warn('warning: stack has more than one element');
          // this.reduce();
        }

        // console.log('parse returning');
        // console.log('stack', stack.length, require('util').inspect(stack, { depth: 5}));
        // console.log('input', this.input, this.inputPosition);
        // return this.popOperand().expression;
        // return reduceUntil === 0 ? this.popOperand().expression : true;
        return stack[stack.length - 1].expression;
      case 'parenthesis-left':
        // sub-expression
        // console.log('sub-expression')
        this.parse(stack.length);
        // const subExpression = this.parse(stack.length);
        // stack.push(new Token({ }))
        // console.log('back from sub-expression');

        // console.log('stack before pop', stack);
        if ((stack[stack.length - 1] && stack[stack.length - 1].type) !== 'parenthesis-right') {
          throw new Error('Expected ")"');
        }
        stack.pop();
        // console.log('stack after pop', stack);
        break;
      case 'binary':
        if (
          (stack.length > reduceUntil && stack[stack.length - 1] && stack[stack.length - 1].type !== 'operand') ||
          (stack.length === reduceUntil)
        ) {
          if (token.expression.operator === 'minus') {
            token.type = 'unary';
            token.expression.operator = 'negate';
            stack.push(token);
            // console.log('stack', stack);
            break;
          }
        }

        while (
          stack.length > 1 + reduceUntil &&
          ExpressionParser.precedence(token) <= ExpressionParser.precedence(stack[stack.length - 2])
        ) {
          if (!this.reduce()) {
            return false;
          }
        }

        stack.push(token);
        break;
      case 'unary':
      case 'operand':
        stack.push(token);
        break;
      default:
        throw new Error(`unrecognized token type "${token.type}"`);
    }
  }

  throw new Error(`parser got stuck, ${this.inputPosition}, "${this.input}" --> "${this.input.substr(this.inputPosition)}"`);
};

ExpressionParser.precedence = function precedence(token) {
  const { type } = token;
  if (['binary', 'unary', 'operand'].indexOf(type) === -1) {
    throw new Error(`Unexpected token type: "${type}"`);
  }

  if (type === 'unary') {
    return 30;
  }

  const operator = token.expression && token.expression.operator;
  switch (operator) {
    case 'times':
    case 'divide':
      return 20;
    case 'plus':
    case 'minus':
      return 10;
    default:
      break;
  }

  if (type === 'operand') {
    return 0;
  }

  throw new Error(`Unexpected operator: "${operator}"`);
};

module.exports = ExpressionParser;
