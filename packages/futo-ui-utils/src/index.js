// @futo-ui/base
const apply = (arg, f) => {
  switch(true) {
    case isarray(arg): return arg.map(f);
    case isobject(arg): return map(arg, f);
    default: return f(arg);
  }
}

const applyTwoObjs = (obj1, obj2, fn) => map({ ...obj1, ...obj2 }, (_, k) => fn((obj1[k] || 0), (obj2[k] || 0)));
const applyObjAndNum = (obj, num, fn) => map(obj, v => fn(v, num));

const applyTwoObjsSwitch = (obj1, obj2, fn) => { switch(true) {
  case isobject(obj1) && isobject(obj2): return applyTwoObjs(obj1, obj2, fn);
  case isobject(obj1) && isnumber(obj2): return applyObjAndNum(obj1, obj2, fn);
}}

// @futo-ui/css
export const ellipsis = (l = 1) => ({ overflow: "hidden", textOverflow: "ellipsis", ...(l === 1 ? { whiteSpace: "nowrap" } : { display: "-webkit-box !important", WebkitBoxOrient: "vertical", WebkitLineClamp: l }) });
export const nonselectable = { WebkitTouchCallout: "none", WebkitUserSelect: "none", KhtmlUserSelect: "none", MozUserSelect: "none", MsUserSelect: "none", UserSelect: "none" };
export const selectable = { WebkitTouchCallout: "auto", WebkitUserSelect: "auto", KhtmlUserSelect: "auto", MozUserSelect: "auto", MsUserSelect: "auto", UserSelect: "auto" };
export const padding = (el, side) => parseInt(window.getComputedStyle(el, null).getPropertyValue('padding-'+side));
export const rotate = (angle, unit = "rad") => ({ transform: "rotate("+angle+unit+")" });
export const translate = (obj, unit = "px") => ({ transform: "translate("+values(convert(point(obj), unit)).join(", ")+")" });

// @futo-ui/maths
const alnumStr = str => { switch(str) {
  case "left": case "top": return 0;
  case "center": return 0.5;
  case "right": case "bottom": return 1;
}} 
const alnumObj = obj => map(obj, v => alnumStr(v));

export const alnum = (obj) => {
  switch(true) {
    case isstring(obj): return alnumStr(obj);
    case isobject(obj): return alnumObj(obj); 
  }
}

export const altoa = ({ x, y, height, width }, { x: fax, y: fay }, { x: tax, y: tay } = { x: 0, y: 0 }) => ({ x: x + (tax - fax) * width, y: y + (tay - fay) * height });

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
export const delta = (obj1, obj2) => applyTwoObjsSwitch(obj1, obj2, (a, b) => a - b);
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
export const incirc = ({ x: cx, y: cy }, { x, y, radius }) => Math.pow(x - cx, 2) + Math.pow(y - cy, 2) < Math.pow(radius, 2);
export const inside = ({ x, y }, { bottom, left, right, top }) => left <= x && x <= right && top <= y && y <= bottom;
export const ispoint = val => val.x !== undefined && val.y !== undefined;
export const int = arg => apply(arg, v => parseInt(v, 0));

const maxArray = arr => empty(arr) ? -Infinity : arr.reduce((a, b) => Math.max(a, b));

export const max = (...args) => {
  switch(args.length) {
    case 1: return maxArray(args[0]);
    default: return maxArray(args);
  }
}

const minArray = arr => empty(arr) ? Infinity : arr.reduce((a, b) => Math.min(a, b));

export const min = (...args) => {
  switch(args.length) {
    case 1: return minArray(args[0]);
    default: return minArray(args);
  }
}

export const minus = ({ x, y }) => ({ x: -x, y: -y });
export const mult = (obj1, obj2) => applyTwoObjsSwitch(obj1, obj2, (a, b) => a * b);
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

export const polar = ({ x, y }) => ({ angle: Math.atan2(y, x) + Math.PI, radius: pyth(x, y) });
export const pyth = (a, b) => Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) 

const rectElement = el => el.getBoundingClientRect().toJSON();
const rectCalculate = ({ x, y }, { height, width }) => ({ left: x, top: y, right: x + width, bottom: y + height, height, width });

export const round = Math.round;
export const rect = (...args) => {
  switch(args.length) {
    case 1: return rectElement(...args);
    case 2: return rectCalculate(...args);
  }
}

const sumArray = arr => isobject(arr[0]) ? sumArrayObjects(arr) : sumArrayNumbers(arr);
const sumArrayNumbers = arr => empty(arr) ? 0 : arr.reduce((a, b) => a + b);
const sumArrayObjects = arr => empty(arr) ? {} : arr.reduce((a, b) => sumTwoObjects(a, b));
const sumTwoObjects = (obj1, obj2) => {
  switch(true) {
    case isobject(obj1) && isobject(obj2):
      return map({ ...obj1, ...obj2 }, (_, k) => (obj1[k] || 0) + (obj2[k] || 0));
    case isobject(obj1) && isnumber(obj2):
      return map(obj1, v => v + obj2);
  }
}

export const sum = (...args) => isarray(args[0]) ? sumArray(args[0]) : sumArray(args);

export const xylt = ({ x, y }) => ({ left: x, top: y });
export const xyltrb = ({ x, y }) => ({ ...xylt({ x, y }), right: x, bottom: y });
export const ltxy = ({ left, top }) => ({ x: left, y: top });

// @futo-ui/array
export const arrayize = obj => isarray(obj) ? obj : [obj];

const addindex = (arr, item, comp = (a, b) => a - b) => {
  if (arr.length === 0 || comp(item, arr[0]) < 0) return 0;
  if (0 < comp(item, last(arr))) return arr.length;
  let i = 0, j = arr.length - 1;
  while(i < j) {
    const k = Math.floor((i + j) / 2);
    if (comp(item, arr[k]) === 0) return k;
    if (0 < comp(item, arr[k])) { i = k + 1; } else { j = k; }
  }
  if (j <= i) return i;
}

export const addsort = (arr, item, comp) => {
  const i = addindex(arr, item, comp);
  return [...arr.slice(0, i), item, ...arr.slice(i)]; 
}

export const diff = (arr1, arr2) => arr1.filter(v => arr2.indexOf(v) === -1).concat(arr2.filter(v => arr1.indexOf(v) === -1)); // symmetric difference
export const insert = (arr, index, items) => [...arr.slice(0, index), ...items, ...arr.slice(index)];
export const intrsct = (arr1, arr2) => {
  let i = 0, j = 0;
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] === arr2[j]) { return true; }
    else if (arr1[i] < arr2[j]) { i++; }
    else if (arr1[i] > arr2[j]) { j++; }
  }
  return false;
}
export const pick = (arr, i) => { if (arr.indexOf(i) !== -1) { arr.shift(); return true; } else { return false; } } // array has to be sorted & set of i contains arr // !!! BEWARE, IT AFFECTS THE FIRST PARAM
export const union = (...initArgs) => { const args = initArgs.filter(arg => arg !== undefined); return uniq(args.length === 1 ? [].concat(...args[0]) : [].concat(...args)) };
export const uniq = arr => [...new Set(arr)]; 

// @futo-ui/mui
export const sxu = (sx1, sx2) => {
  const isf1 = isfunction(sx1), isf2 = isfunction(sx2);
  return isf1 || isf2 ? t => ({ ...(isf1 ? sx1(t) : sx1), ...(isf2 ? sx2(t) : sx2) }) : { ...sx1, ...sx2 };
}

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
export const isnumber = num => !isNaN(num);
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

export const clear = () => {
  const sel = window.getSelection();
  return sel.empty ? sel.empty() : sel.removeAllRanges();
}

const focusElement = (el, offset) => {
  const sel = window.getSelection(), range = document.createRange(), node = el.childNodes.length === 0 ? el : el.childNodes[0];
  range.setStart(node, node.length < offset ? node.length : offset); range.collapse(true);
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

const offsetCountTill = (parent, target) => {
  let offset = 0;
  [...parent.childNodes].some(node => {
    if (node !== target) {
     if (node.nodeType === 1) offset += offsetCountTill(node, target); // Node.ELEMENT_NODE === 1
     if (node.nodeType === 3) offset += node.nodeValue.length; // Node.TEXT_NODE === 3
    }
    return node === target;
  })
  return offset;
}

const offsetCurrent = () => window.getSelection().anchorNode === null ? 0 : window.getSelection().getRangeAt(0).startOffset;

const offsetPoint = ({ parent, target, x, y }) => {
  const totalOffset = parent && target && parent !== target ? offsetCountTill(parent, target) : 0,
        r = document[document.caretPositionFromPoint ? 'caretPositionFromPoint' : 'caretRangeFromPoint'](x, y);
  return totalOffset + (r.startOffset === undefined ? r.offset : r.startOffset);
}

export const offset = (...args) => {
  switch(args.length) {
    case 0: return offsetCurrent();
    case 1: return offsetPoint(args[0]);
  }
}

export const selected = () => {
  if (window.getSelection !== undefined) return window.getSelection().toString(); 
  if (document.selection !== undefined && document.selection.type == "Text") return document.selection.createRange().text;
}

// @futo-ui/events
export const iselement = o => typeof HTMLElement === "object" ? o instanceof HTMLElement : o && isobject(o) && o.nodeType === 1 && typeof o.nodeName === "string";
export const isevent = e => e && (e instanceof Event || (e.nativeEvent && e.nativeEvent instanceof Event)) 
export const clientXY = e => ({ x: e.clientX, y: e.clientY });
export const screenXY = e => ({ x: e.screenX, y: e.screenY });
export const metactrlkey = e => e.ctrlKey || e.metaKey;
export const mousein = (e, rect) => inside(clientXY(e), rect);

// @futo-ui/images
export const base64 = (str, types) => str && isstring(str) && str.match(new RegExp("^data:"+(types ? "("+types.map(t => t.replace("/", "\\/")).join("|")+")" : "\\w+/[-+.\\w]+(\\w+=[^;]+;)?")+";base64"));
export const blobtobase64 = async blob => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = () => resolve(reader.result);
  reader.onerror = (...args) => reject(args);
});
export const canvas = img => {
  const canvas = document.createElement("canvas"); canvas.height = img.height; canvas.width = img.width;
  canvas.getContext('2d').drawImage(img, 0, 0); return canvas;
};
export const crop = (sourceCanvas, { x: fx, y: fy, height: fh, width: fw }, { x: tx = 0, y: ty = 0, height: th, width: tw }) => {
  const canvas = document.createElement("canvas"); canvas.width = tw; canvas.height = th;
  canvas.getContext("2d").drawImage(sourceCanvas, fx, fy, fw, fh, tx, ty, tw, th);
  return canvas;
};
export const fit = ({ height: h, width: w }, { height: fh, width: fw }) => {
  const r = h / w, fr = fh / fw, mh = min(h, fh), mw = min(w, fw);
  return r > fr ? { height: mh, width: mh / r } : { height: r * mw, width: mw };
};
export const tif = ({ height: h, width: w }, { height: fh, width: fw }) => {
  const r = h / w, fr = fh / fw, mh = max(h, fh), mw = max(w, fw);
  return r > fr ? { height: r * mw, width: mw } : { height: mh, width: mh / r };
};
export const image = async obj => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = (...args) => reject(args);
  img.src = obj instanceof Blob ? URL.createObjectURL(obj) : obj;
});
export const imgwh = async url => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve({ height: img.height, width: img.width });
  img.onerror = (...args) => reject(args);
  img.src = url;
});

export const urltobase64 = (url, { height: initHeight, width: initWidth } = {}) => image(url).then(img => {
  const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d'),
        height = initHeight || img.height, width = initWidth || img.width; 

  canvas.height = height; canvas.width = width;
  ctx.drawImage(img, 0, 0, width, height); 
  return canvas.toDataURL();
});

// @futo-ui/misc
export const copy = text => navigator.clipboard ? navigator.clipboard.writeText(text) : new Promise((resolve, reject) => {
  const textArea = document.createElement("textarea"); textArea.value = text; textArea.style.top = "0"; textArea.style.left = "0"; textArea.style.position = "fixed"; // Avoid scrolling to bottom
  document.body.appendChild(textArea); textArea.focus(); textArea.select();
  try { document.execCommand('copy') ? resolve() : reject() } catch (e) { reject(e) }
  document.body.removeChild(textArea);
});
export const popup = (url, { height, width }, title) => window.open(url, title, 'resizable=yes, width=' + width + ', height=' + height + ', top=' + (screen.height / 2 - height / 2) + ', left=' + (screen.width / 2 - width / 2));

// @futo-ui/scroll
export const scroll = diff => window.scrollBy(0, diff);
scroll.down = diff => { if (0 < diff) scroll(diff); }
scroll.up = diff => { if (diff < 0) scroll(diff); }

// @futo-ui/string
export const capitalize = str => str ? str[0].toUpperCase() + str.slice(1) : null;
export const isstring = str => typeof str === "string";
export const url = str => str.match(/^(https?:\/\/)?[\w-]+(\.[\w-]+)*\.?(:\d+)?(\/\S*)?$/gi);

// @futo-ui/reducers
export const combineReducers = reducers => (state, action) => { return keys(reducers).reduce((accState, reducerKey) => { 
  const prop = reducerKey.replace(/Reducer$/, "");
  return { ...accState, [prop]: reducers[reducerKey](state[prop], action) };
}, state)};
