import { fingers, keymap } from "~/scripts/keymap.js";

function sequences(letters, rightHand) {
  const getNeedSpace = (l) =>
    l != " " &&
    (!(l in fingers) ||
      (rightHand && fingers[l] < 5) ||
      (!rightHand && fingers[l] > 4));
  const getActualLetter = (letter) =>
    letter == " "
      ? "space"
      : letter in keymap && getNeedSpace(letter)
      ? keymap[letter]
      : letter;
  const result = [
    {
      spaceHeld: getNeedSpace(letters[0]),
      letters: [getActualLetter(letters[0])],
    },
  ];
  for (const letter of letters.slice(1)) {
    const needSpace = getNeedSpace(letter);
    const current = result.slice(-1)[0];
    const actualLetter = getActualLetter(letter);
    if (needSpace == current.spaceHeld) {
      current.letters.push(actualLetter);
    } else {
      result.push({ letters: [actualLetter], spaceHeld: needSpace });
    }
  }
  return result;
}

export { sequences };
