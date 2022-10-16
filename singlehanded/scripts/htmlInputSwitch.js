import keymap from "./keymap";
function typeInTextarea(newText, el = document.activeElement) {
  const [start, end] = [el.selectionStart, el.selectionEnd];
  el.setRangeText(newText, start, end, "end");
}
function backspace(el = document.activeElement) {
  if (el.selectionStart > 0) {
    el.setRangeText("", el.selectionStart - 1, el.selectionStart, "end");
  }
}
function init() {
  let space = false;
  let usedSpace = false;
  function keyListener(event) {
    if (
      (event.key != " " && !(event.key in keymap)) ||
      event.ctrlKey ||
      event.altKey
    ) {
      return;
    }
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
    if (event.key == " ") {
      if (event.type == "keydown" && !space) {
        space = true;
        typeInTextarea(" ");
      } else if (event.type == "keyup") {
        space = false;
        usedSpace = false;
      }
    } else if (event.type == "keydown") {
      if (space) {
        if (!usedSpace) {
          usedSpace = true;
          backspace();
        }
        typeInTextarea(keymap[event.key]);
      } else {
        typeInTextarea(event.key);
      }
    }
  }
  window.addEventListener("keydown", keyListener, true);
  window.addEventListener("keyup", keyListener, true);
}
export default init;
