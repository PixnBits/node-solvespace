// A list, where each element has an integer identifier. The list is kept
// sorted by that identifier, and items can be looked up in log n time by
// id.

/**
 * Implemented before seeing the original code & docs
 * FIXME: implement SolveSpace's version
 * IIUC should be easy, as we'd just use an Array
 * (thus, just more performant than what is here already)
 * definition from dsc.h:269
 */
function IdList() {
  this.list = [];
}

IdList.prototype.count = function count() {
  return this.list.length;
};

IdList.prototype.get = function get(id) {
  const entry = this.list.find(({ id: entryId }) => entryId === id);
  if (entry) {
    return entry.val;
  }
  // TODO warn?
  return undefined;
};
IdList.prototype.findById = IdList.prototype.get;

IdList.prototype.has = function has(id) {
  return !!this.get(id);
};

IdList.prototype.set = function set(id, val) {
  this.list = this.list.filter(({ id: entryId }) => entryId !== id);
  this.list.unshift({ id, val });
};

IdList.prototype.add = function add(id, val) {
  if (this.has(id)) {
    throw new Error(`"${id}" already exists in IdList"`);
  }
  this.list.unshift({ id, val });
};

IdList.prototype.clear = function clear() {
  this.list.splice(0, this.list.length);
};


[
  'forEach',
  'some',
  'every',
]
  .forEach((methodName) => {
    IdList.prototype[methodName] = function invokeArrayMethod(cb) {
      this.list[methodName](({ id, val }) => cb(val, id));
    };
  });

module.exports = IdList;
