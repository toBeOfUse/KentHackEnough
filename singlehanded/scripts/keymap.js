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
export default keymap;
