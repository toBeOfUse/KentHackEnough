const keymap = {};

function setKeyMapPair(key1, key2) {
  keymap[key1] = key2;
  keymap[key2] = key1;
  keymap[key1.toLowerCase()] = key2.toLowerCase();
  keymap[key2.toLowerCase()] = key1.toLowerCase();
}

setKeyMapPair("A", ";");
setKeyMapPair("B", "B");
setKeyMapPair("C", "M");
setKeyMapPair("D", "K");
setKeyMapPair("E", "O");
setKeyMapPair("F", "J");
setKeyMapPair("G", "H");
setKeyMapPair("I", "R");
setKeyMapPair("L", "S");
setKeyMapPair("N", "V");
setKeyMapPair("P", "W");
setKeyMapPair("Q", "[");
setKeyMapPair("T", "U");
setKeyMapPair("X", ",");
setKeyMapPair("Y", "Y");
setKeyMapPair("Z", ".");

keymap[":"] = "A";
keymap["{"] = "Q";
keymap["<"] = "X";
keymap[">"] = "Z";

const fingers = {
  a: 1,
  q: 1,
  z: 1,
  w: 2,
  s: 2,
  x: 2,
  e: 3,
  d: 3,
  c: 3,
  r: 4,
  f: 4,
  v: 4,
  t: 4,
  g: 4,
  y: 5,
  h: 5,
  b: 5,
  u: 5,
  j: 5,
  n: 5,
  i: 6,
  k: 6,
  m: 5,
  o: 7,
  l: 7,
  ",": 7,
  ".": 7,
  p: 8,
  ";": 8,
  ".": 8,
};

export { keymap, fingers };
