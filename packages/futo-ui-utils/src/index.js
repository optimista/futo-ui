// @futo-ui/base
const apply = (arg, f) => {
  switch(true) {
    case isarray(arg): return arg.map(f);
    case isobject(arg): return map(arg, f);
    default: return f(arg);
  }
}

// @futo-ui/css
export const nondraggable = { WebkitUserDrag: "none", KhtmlUserDrag: "none", MozUserDrag: "none", OUserDrag: "none", UserDrag: "none" };
export const nonselectable = { WebkitTouchCallout: "none", WebkitUserSelect: "none", KhtmlUserSelect: "none", MozUserSelect: "none", MsUserSelect: "none", UserSelect: "none" };
export const padding = (el, side) => parseInt(window.getComputedStyle(el, null).getPropertyValue('padding-'+side));
export const rotate = (angle, unit = "rad") => ({ transform: "rotate("+angle+unit+")" });
export const translate = (obj, unit = "px") => ({ transform: "translate("+values(convert(point(obj), unit)).join(", ")+")" });

// @futo-ui/maths
const avgArray =  arr => divide(sum(arr), arr.length);
export const avg = (...args) => isarray(args[0]) ? avgArray(args[0]) : avgArray(args);

const boundValue = (x, min, max) => Math.min(Math.max(min, x), max);
const boundPoint = ({ x, y }, maxX, maxY) => ({ x: boundValue(x, 0, maxX), y: boundValue(y, 0, maxY) });
const boundElement = (p, el) => boundPoint(p, el.offsetWidth, el.offsetHeight);

export const bound = (...args) => {
  switch(args.length) {
    case 2: return boundElement(args[0], args[1]);
    case 3: return args[0].x === undefined && args[0].y === undefined ? boundValue(...args) : boundPoint(...args);
  }
}

export const cartesian = ({ angle, radius }) => ({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
export const center = ({ left, width, top, height }) => ({ x: left + width / 2, y: top + height / 2 });
export const convert = (value, unit) => { switch(unit) {
  case "%": return pct(value);
  case "px": return px(value);
}}
export const delta = (val1, val2) => { let res = { ...val1 }; for (let key in val2) res[key] = (res[key] || 0) - val2[key]; return res; }
export const divide = (dividend, divisor) => isobject(dividend) ? map(dividend, v => v / divisor) : dividend / divisor;

const extendComplete = ({ left, top, right, bottom, height, width }, p) => ({ left: left - p[0], top: top - p[1], right: right + p[2], bottom: bottom + p[3], height: height + p[1] + p[3], width: width + p[0] + p[2] });
  
export const extend = (r, p) => {
  switch(p.length) {
    case 1: return extendComplete(r, [p[0], p[0], p[0], p[0]]);
    case 2: return extendComplete(r, [p[0], p[1], p[0], p[1]]);
    case 3: return extendComplete(r, [p[0], p[1], p[2], p[1]]);
    case 4: return extendComplete(r, p);
  }
}

export const float = arg => apply(arg, v => parseFloat(v));
export const inside = ({ x, y }, { bottom, left, right, top }) => left <= x && x <= right && top <= y && y <= bottom;
export const ispoint = val => val.x !== undefined && val.y !== undefined;
export const int = arg => apply(arg, v => parseInt(v, 0));
export const max = arr => empty(arr) ? -Infinity : arr.reduce((a, b) => Math.max(a, b));
export const min = arr => empty(arr) ? Infinity : arr.reduce((a, b) => Math.min(a, b));
export const minus = ({ x, y }) => ({ x: -x, y: -y });

export const pct = arg => apply(arg, v => 100 * v + "%");
export const point = obj => ({ x: obj.x, y: obj.y });
export const px = arg => apply(arg, v => {
  const unit = ((v + "").match(/[a-z]+/) || [""])[0]; let i = 0;
  switch(unit) {
    case "rem": i = float(v) * float(getComputedStyle(document.documentElement).fontSize); break;
    default: i = v; break;
  }
  return i+"px";
})

export const polar = ({ x, y }) => ({ angle: Math.atan2(y, x) + Math.PI, radius: Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) });

const rectElement = el => el.getBoundingClientRect().toJSON();
const rectCalculate = ({ x, y }, { height, width }) => ({ left: x, top: y, right: x + width, bottom: y + height, height, width });

export const rect = (...args) => {
  switch(args.length) {
    case 1: return rectElement(...args);
    case 2: return rectCalculate(...args);
  }
}

const sumArray = arr => isobject(arr[0]) ? sumArrayObjects(arr) : sumArrayNumbers(arr);
const sumArrayNumbers = arr => empty(arr) ? 0 : arr.reduce((a, b) => a + b);
const sumArrayObjects = arr => empty(arr) ? {} : arr.reduce((a, b) => sumTwoObjects(a, b));
const sumTwoObjects = (obj1, obj2) => map({ ...obj1, ...obj2 }, (_, k) => (obj1[k] || 0) + (obj2[k] || 0));

export const sum = (...args) => isarray(args[0]) ? sumArray(args[0]) : sumArray(args);

export const xylt = ({ x, y }) => ({ left: x, top: y });
export const xyltrb = ({ x, y }) => ({ ...xylt({ x, y }), right: x, bottom: y });
export const ltxy = ({ left, top }) => ({ x: left, y: top });

// @futo-ui/array
export const arrayize = obj => isarray(obj) ? obj : [obj];
export const insert = (arr, index, items) => [...arr.slice(0, index), ...items, ...arr.slice(index)];
export const uniq = arr => [...new Set(arr)]; 

// @futo-ui/promises
export const delay = ms => new Promise(r => setTimeout(r, ms));

// @futo-ui/object
export const each = (obj, callback) => keys(obj).map((k, i) => callback(obj[k], k, i));
export const entries = obj => Object.entries(obj);

const emptyArray = arr => arr.length === 0;
const emptyObject = obj => emptyArray(keys(obj));
const emptyString = str => str.trim() === "";

export const empty = arg => {
  switch(true) {
    case isarray(arg): return emptyArray(arg);
    case isobject(arg): return emptyObject(arg);
    case isstring(arg): return emptyString(arg);
    case arg === undefined:
    case arg === null:
    default: return true;
  }
}

const equalArrays = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) { const val1 = arr1[i], val2 = arr2[i]; if (!equal(val1, val2)) return false; }
  return true;
}

const equalObjects = (obj1, obj2) => {
  const ks1 = keys(obj1); const ks2 = keys(obj2); if (ks1.length !== ks2.length) return false;
  for (const k of ks1) { const val1 = obj1[k]; const val2 = obj2[k]; if (!equal(val1, val2)) return false; }
  return true;
}

export const equal = (obj1, obj2) => {
  switch(true) {
    case isarray(obj1) && isarray(obj2): return equalArrays(obj1, obj2);
    case isobject(obj1) && isobject(obj2): return equalObjects(obj1, obj2);
    default: return obj1 === obj2;
  }
}

const filterArray = (arr, callback) => arr.filter(callback);
const filterObject = (obj, callback) => object(entries(obj).filter(n => callback(n[0], n[1])))

export const filter = (...args) => {
  switch(true) {
    case isarray(args[0]): return filterArray(...args);
    case isobject(args[0]): return filterObject(...args);
  }
}

export const isarray = arr => Array.isArray(arr);
export const isfunction = obj => typeof obj === 'function'
export const isobject = obj => obj != null && typeof obj === 'object';
export const keys = obj => Object.keys(obj || []);
export const last = (arr, i = -1) => arr[arr.length+i];
export const map = (obj, callback) => object(entries(obj).map((n, i) => [n[0], callback(obj[n[0]], n[0], i)])); // (value, key, index) =>
export const maxKey = obj => size(obj) === 0 ? -1 : max(keys(obj));
export const object = entries => Object.fromEntries(entries);
export const select = (obj, keys) => object(keys.map(k => [k, obj[k]]));
export const size = obj => keys(obj).length;
export const values = obj => Object.values(obj);

// @futo-ui/caret
export const blur = () => document.activeElement.blur();

export const caret = () => { 
  const range = window.getSelection().getRangeAt(0); let bcrect = range.getBoundingClientRect();
  if (range.collapsed && bcrect.top === 0 && bcrect.left === 0) {
    let tmpNode = document.createTextNode('\ufeff'); range.insertNode(tmpNode);
    bcrect = rect(range); tmpNode.remove();
  }
  return bcrect;
}

const focusElement = (el, offset) => {
  const sel = window.getSelection(), range = document.createRange();
  range.setStart(el.childNodes.length === 0 ? el : el.childNodes[0], offset); range.collapse(true);
  sel.removeAllRanges(); sel.addRange(range);
}

const focusPoint = ({ x, y }) => {
  const sel = window.getSelection(), range = document.caretRangeFromPoint(x, y);
  sel.removeAllRanges(); sel.addRange(range);
}

export const focus = (...args) => {
  switch(args.length) {
    case 1: return focusPoint(args[0]);
    case 2: return focusElement(args[0], args[1]);
  }
}

const offsetCurrent = () => window.getSelection().anchorNode === null ? 0 : window.getSelection().getRangeAt(0).startOffset;

const offsetPoint = ({ x, y }) => {
  const r = document[document.caretPositionFromPoint ? 'caretPositionFromPoint' : 'caretRangeFromPoint'](x, y);
  return r.startOffset === undefined ? r.offset : r.startOffset;
}

export const offset = (...args) => {
  switch(args.length) {
    case 0: return offsetCurrent();
    case 1: return offsetPoint(args[0]);
  }
}

// @futo-ui/events
export const isevent = e => e && (e instanceof Event || (e.nativeEvent && e.nativeEvent instanceof Event)) 
export const clientXY = e => ({ x: e.clientX, y: e.clientY });
export const screenXY = e => ({ x: e.screenX, y: e.screenY });
export const mousein = (e, rect) => inside(clientXY(e), rect);

// @futo-ui/scroll
export const scroll = diff => window.scrollBy(0, diff);
scroll.down = diff => { if (0 < diff) scroll(diff); }
scroll.up = diff => { if (diff < 0) scroll(diff); }

// @futo-ui/string
export const capitalize = str => str[0].toUpperCase() + str.slice(1);
export const isstring = str => typeof str === "string";

// @futo-ui/misc
export const base64 = (str, types) => str.match(new RegExp("^data:"+(types ? "("+types.map(t => t.replace("/", "\\/")).join("|")+")" : "\\w+/[-+.\\w]+(\\w+=[^;]+;)?")+";base64"));

export const combineReducers = reducers => (state, action) => { return keys(reducers).reduce((accState, reducerKey) => { 
  const prop = reducerKey.replace(/Reducer$/, "");
  return { ...accState, [prop]: reducers[reducerKey](state[prop], action) };
}, state)};
