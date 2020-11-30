// @futo-ui/base
const apply = (arg, f) => {
  switch(true) {
    case isarray(arg): return arg.map(f); break;
    case isobject(arg): return map(arg, f); break;
    default: return f(arg); break;
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
    case 2: return boundElement(args[0], args[1]); break;
    case 3: return args[0].x === undefined && args[0].y === undefined ? boundValue(...args) : boundPoint(...args); break;
  }
}

export const cartesian = ({ angle, radius }) => ({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
export const center = ({ left, width, top, height }) => ({ x: left + width / 2, y: top + height / 2 });
export const convert = (value, unit) => { switch(unit) {
  case "%": return pct(value); break;
  case "px": return px(value); break;
}}
export const delta = (val1, val2) => { let res = { ...val1 }; for (let key in val2) res[key] = (res[key] || 0) - val2[key]; return res; }
export const divide = (dividend, divisor) => isobject(dividend) ? map(dividend, (v, k) => v / divisor) : dividend / divisor;

const extendComplete = ({ left, top, right, bottom, height, width }, p) => ({ left: left - p[0], top: top - p[1], right: right + p[2], bottom: bottom + p[3], height: height + p[1] + p[3], width: width + p[0] + p[2] });
  
export const extend = (r, p) => {
  switch(p.length) {
    case 1: return extendComplete(r, [p[0], p[0], p[0], p[0]]); break;
    case 2: return extendComplete(r, [p[0], p[1], p[0], p[1]]); break;
    case 3: return extendComplete(r, [p[0], p[1], p[2], p[1]]); break;
    case 4: return extendComplete(r, p); break;
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
export const rect = el => el.getBoundingClientRect().toJSON();

const sumArray = arr => isobject(arr[0]) ? sumArrayObjects(arr) : sumArrayNumbers(arr);
const sumArrayNumbers = arr => empty(arr) ? 0 : arr.reduce((a, b) => a + b);
const sumArrayObjects = arr => empty(arr) ? {} : arr.reduce((a, b) => sumTwoObjects(a, b));
const sumTwoObjects = (obj1, obj2) => map({ ...obj1, ...obj2 }, (_, k) => (obj1[k] || 0) + (obj2[k] || 0));

export const sum = (...args) => isarray(args[0]) ? sumArray(args[0]) : sumArray(args);

export const xylt = ({ x, y }) => ({ left: x, top: y });
export const xyltrb = ({ x, y }) => ({ ...xylt({ x, y }), right: x, bottom: y });
export const ltxy = ({ left, top }) => ({ x: left, y: top });

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
    default: return emptyString(arg);
  }
}

export const equal = (obj1, obj2) => {
  const ks1 = keys(obj1); const ks2 = keys(obj2);
  if (ks1.length !== ks2.length) return false;

  for (const k of ks1) {    
    const val1 = obj1[k]; const val2 = obj2[k]; const areobjects = isobject(val1) && isobject(val2), notfunctions = (!isfunction(val1) && !isfunction(val2));
    if (notfunctions && (areobjects ? !equal(val1, val2) : val1 !== val2)) return false;
  }

  return true;
}
export const filter = (obj, callback) => object(entries(obj).filter(n => callback(n[1], n[0])))
export const isarray = arr => Array.isArray(arr);
export const isfunction = obj => typeof obj === 'function'
export const isobject = obj => obj != null && typeof obj === 'object';
export const keys = obj => Object.keys(obj);
export const last = (arr, i = -1) => arr[arr.length+i];
export const map = (obj, callback) => object(entries(obj).map((n, i) => [n[0], callback(obj[n[0]], n[0], i)]));
export const maxKey = obj => size(obj) === 0 ? -1 : max(keys(obj));
export const object = entries => Object.fromEntries(entries);
export const size = obj => keys(obj).length;
export const values = obj => Object.values(obj);

// @futo-ui/caret
export const blur = () => document.activeElement.blur();

export const caret = () => { 
  const range = window.getSelection().getRangeAt(0); let rect = range.getBoundingClientRect();
  if (range.collapsed && rect.top === 0 && rect.left === 0) {
    let tmpNode = document.createTextNode('\ufeff'); range.insertNode(tmpNode);
    rect = rect(range); tmpNode.remove();
  }
  return rect;
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
    case 1: return focusPoint(args[0]); break;
    case 2: return focusElement(args[0], args[1]); break;
  }
}

const offsetCurrent = () => window.getSelection().getRangeAt(0).startOffset;

const offsetPoint = ({ x, y }) => {
  const r = document[document.caretPositionFromPoint ? 'caretPositionFromPoint' : 'caretRangeFromPoint'](x, y);
  return r.startOffset || r.offset;
}

export const offset = (...args) => {
  switch(args.length) {
    case 0: return offsetCurrent(); break;
    case 1: return offsetPoint(args[0]); break;
  }
}

// @futo-ui/events
export const clientXY = e => ({ x: e.clientX, y: e.clientY });
export const mousein = (e, rect) => inside(clientXY(e), rect);

// @futo-ui/scroll
export const scroll = diff => window.scrollBy(0, diff);
scroll.down = diff => { if (0 < diff) scroll(diff); }
scroll.up = diff => { if (diff < 0) scroll(diff); }

// @futo-ui/string
export const capitalize = str => str[0].toUpperCase() + str.slice(1);

// @futo-ui/time
// Basic unit is milliseconds
export const hours = millis => Math.floor(Math.abs(millis) / 36e5);
export const minutes = millis => Math.floor(Math.abs(millis) / 6e4);
export const seconds = millis => Math.floor(Math.abs(millis) / 1e3);

export const time = timestamp => {
  const date = new Date(timestamp), curr = new Date();
  if (curr.getYear() !== date.getYear()) return (new Date(timestamp)).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric" }); // Jun 21, 2019

  const h = hours(curr - date);
  if (23 < h) return date.toLocaleString(undefined, { month: "short", day: "numeric" }); // Jun 21

  const m = minutes(curr - date);
  if (59 < m) return h + "h"; // 20h

  const s = seconds(curr - date);
  if (59 < s) return m + "m"; // 30m

  if (0 < s) return s + "s";

  return "Now";
}
