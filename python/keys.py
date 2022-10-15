keymap: dict[str, str] = {}

def setKeyMapPair(key1: str, key2: str):
    keymap[key1] = key2
    keymap[key2] = key1
    keymap[key1.lower()] = key2.lower()
    keymap[key2.lower()] = key1.lower()

setKeyMapPair('A', ';');
setKeyMapPair('B', 'B');
setKeyMapPair('C', 'M');
setKeyMapPair('D', 'K');
setKeyMapPair('E', 'O');
setKeyMapPair('F', 'J');
setKeyMapPair('G', 'H');
setKeyMapPair('I', 'R');
setKeyMapPair('L', 'S');
setKeyMapPair('N', 'V');
setKeyMapPair('P', 'W');
setKeyMapPair('Q', '[');
setKeyMapPair('T', 'U');
setKeyMapPair('X', ',');
setKeyMapPair('Y', 'Y');
setKeyMapPair('Z', '.');

keymap[":"] = "A"
keymap["{"] = "Q"
keymap["<"] = "X"
keymap[">"] = "Z"
