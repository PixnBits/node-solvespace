// A list, where each element has an integer identifier. The list is kept
// sorted by that identifier, and items can be looked up in log n time by
// id.

/**
 * definition from src/dsc.h:269
 * implementation from src/dsc.h:269
 * @member T elem
 * @member Number n
 * @member elemsAllocated
 */
function IdList(typeConstructor, handleConstructor) {
  if (typeof typeConstructor !== 'function') {
    throw new Error(`IdList requires T to be a constructor (was ${typeof typeConstructor})`);
  }

  if (typeof handleConstructor !== 'function') {
    throw new Error(`IdList requires T to be a constructor (was ${typeof handleConstructor})`);
  }

  this.typeConstructor = typeConstructor;
  this.handleConstructor = handleConstructor;

  this.elem = {};
  this.n = 0;
  this.elemsAllocated = 0;
}

/**
 * definition from src/dsc.h:279
 * implementation from src/dsc.h:279
 * @returns Number
 */
IdList.prototype.maximumId = function maximumId() {
  if (this.n === 0) {
    return 0;
  }
  // return this.elem[this.n - 1].h.v;
  return this.end().h.v;
};

/**
 * definition from src/dsc.h:287
 * implementation from src/dsc.h:287
 * @param T t
 * @returns H
 */
IdList.prototype.addAndAssignId = function addAndAssignId(t) {
  // start at 0
  const m = this.maximumId();
  // "assign" portion of method name indicates we're going to mutate the obj
  if (this.elem[m]) {
    t.h.v = m + 1; // eslint-disable-line no-param-reassign
  } else {
    t.h.v = m; // eslint-disable-line no-param-reassign
  }
  // console.log(`assigned id ${t.h.v} (${this.typeConstructor.name})`);
  // t.h.v = this.maximumId() + 1; // eslint-disable-line no-param-reassign
  this.add(t);

  return t.h;
};

/**
 * definition from src/dsc.h:294
 * implementation from src/dsc.h:294
 * @param Number howMuch
 */
IdList.prototype.reserveMore = function reserveMore(howMuch) {
  // Object memory is handled for us
  this.elemsAllocated += Math.floor(howMuch);
};

/**
 * definition from src/dsc.h:307
 * implementation from src/dsc.h:307
 * @param T t
 */
IdList.prototype.add = function add(t) {
  if (!(t instanceof this.typeConstructor)) {
    throw Error(`attempt to add t not instance of ${this.typeConstructor}`);
  }

  if (this.n >= this.elemsAllocated) {
    this.reserveMore(((this.elemsAllocated + 32) * 2) - this.n);
  }

  const i = t.h.v;
  if (!i && i !== 0) {
    throw new Error('no handle value set');
  }

  if (i < 0) {
    throw new Error('handle value must be >= 0');
  }

  if (this.elem[i] && this.elem[i] !== t) {
    throw new Error(`Handle ${i} isnt unique (${this.typeConstructor.name})`);
  }
  this.elem[i] = t;
  this.n = Math.max(i, this.n);
};

/**
 * definition from src/dsc.h:332
 * implementation from src/dsc.h:332
 * @param H h
 * @returns T
 */
IdList.prototype.findById = function findById(h) {
  const t = this.findByIdNoOops(h);
  if (t === null) {
    throw new Error(`Cannot find handle ${h.v}`);
  }
  return t;
};

/**
 * definition from src/dsc.h:338
 * implementation from src/dsc.h:338
 * @param H h
 * @returns Number
 */
IdList.prototype.indexOf = function indexOf(h) {
  const i = h.v;

  if (!i && i !== 0) {
    throw new Error('no handle value set');
  }

  if (this.elem[i]) {
    return i;
  }

  return -1;
};

/**
 * definition from src/dsc.h:354
 * implementation from src/dsc.h:354
 * @param H h
 * @returns T
 */
IdList.prototype.findByIdNoOops = function findByIdNoOops(h) {
  const i = h.v;

  if (!i && i !== 0) {
    return null;
  }

  return this.elem[i] || null;
};

/**
 * definition from src/dsc.h:370
 * implementation from src/dsc.h:370
 * @returns T
 */
IdList.prototype.first = function first() {
  return this.elem[0] || null;
};

/**
 * definition from src/dsc.h:
 * implementation from src/dsc.h:
 * @param T prev
 * @returns T
 */
IdList.prototype.nextAfter = function nextAfter(t) {
  var i = t.h.v;
  if (!i && i !== 0) {
    return null;
  }

  while (i <= (this.n - 1)) {
    i += 1;
    const next = this.elem[i];
    if (next) {
      return next;
    }
  }
  return null;
};

/**
 * definition from src/dsc.h:379,381
 * implementation from src/dsc.h:379,381
 * @returns T
 */
IdList.prototype.begin = function begin() {
  return this.elem[0];
};

/**
 * definition from src/dsc.h:380,382
 * implementation from src/dsc.h:380,382
 * @param
 * @returns
 */
IdList.prototype.end = function end() {
  return this.elem[this.n];
};

/**
 * definition from src/dsc.h:219
 * implementation from src/dsc.h:219
 * @param
 * @returns
 */
IdList.prototype.clearTags = function clearTags() {
  for (let i = 0; i <= this.n; i += 1) {
    const t = this.elem[i];
    if (t) {
      t.tag = 0;
    }
  }
};

/**
 * definition from src/dsc.h:391
 * implementation from src/dsc.h:391
 * @param H h
 * @param Number tag
 */
IdList.prototype.tag = function tagMethod(h, tag) {
  for (let i = 0; i <= this.n; i += 1) {
    const t = this.elem[i];
    if (t && (t.h.v === h.v)) {
      t.tag = tag;
    }
  }
};

/**
 * definition from src/dsc.h:
 * implementation from src/dsc.h:
 */
IdList.prototype.removeTagged = function removeTagged() {
  for (let src = 0; src <= this.n; src += 1) {
    const t = this.elem[src];
    if (t && t.tag) {
      if (typeof t.clear === 'function') {
        t.clear();
      }
      delete this.elem[src];
    }
  }
};

/**
 * definition from src/dsc.h:419
 * implementation from src/dsc.h:419
 * @param H h
 */
IdList.prototype.removeById = function removeById(h) {
  this.clearTags();
  this.findById(h).tag = 1;
  this.removeTagged();
};

/**
 * definition from src/dsc.h:425
 * implementation from src/dsc.h:425
 * @param IdList<T,H> l
 */
IdList.prototype.moveSelfInto = function moveSelfInto(l) {
  if (this.typeConstructor !== l.typeConstructor) {
    throw new Error('IdLists do not have the same T');
  }
  if (this.handleConstructor !== l.handleConstructor) {
    throw new Error('IdLists do not have the same H');
  }

  // looks similar to `this.clear()` except we don't want to
  // invoke `clear` on the T's stored in this list

  // this is the purpose of this method
  // refactoring away from original (C++) workings needed to change this
  /* eslint-disable no-param-reassign */
  l.clear();
  l.elem = this.elem;
  l.n = this.n;
  l.elemsAllocated = this.elemsAllocated;
  /* eslint-enable no-param-reassign */

  this.elem = {};
  this.n = 0;
  this.elemsAllocated = 0;
};

/**
 * definition from src/dsc.h:432
 * implementation from src/dsc.h:432
 * @param IdList<T,H> l
 */
IdList.prototype.deepCopyInto = function deepCopyInto() {
  throw new Error('unimplemented');
};

/**
 * definition from src/dsc.h:441
 * implementation from src/dsc.h:441
 */
IdList.prototype.clear = function clear() {
  for (let i = 0; i <= this.n; i += 1) {
    const t = this.elem[i];
    if (t && typeof t.clear === 'function') {
      t.clear();
    }
  }
  this.elem = {};
  this.n = 0;
  this.elemsAllocated = 0;
};


module.exports = IdList;

// some methods commonly used in JS
IdList.prototype.forEach = function forEach(cb) {
  const { elem } = this;
  return Object
    .keys(elem)
    .forEach((k) => {
      const v = elem[k];
      cb(v, k, elem);
    });
};

IdList.prototype.every = function every(cb) {
  const { elem } = this;
  return Object
    .keys(elem)
    .every((k) => {
      const v = elem[k];
      return cb(v, k, elem);
    });
};
