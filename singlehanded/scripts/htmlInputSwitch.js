import { keymap } from "./keymap";
function typeInTextarea(newText, el = document.activeElement) {
  const [start, end] = [el.selectionStart, el.selectionEnd];
  el.setRangeText(newText, start, end, "end");
}
function backspace(el = document.activeElement) {
  if (el.selectionStart > 0) {
    el.setRangeText("", el.selectionStart - 1, el.selectionStart, "end");
  }
}
function init(callback) {
  let space = false;
  let usedSpace = false;
  function keyListener(event) {
    if (
      (event.key != " " && !(event.key in keymap)) ||
      event.ctrlKey ||
      event.altKey
    ) {
      if (event.key == "Backspace") {
        const el = document.activeElement;
        if (
          callback &&
          (el.tagName.toLowerCase() == "input" ||
            el.tagName.toLowerCase() == "textarea")
        ) {
          console.log("backspace callback");
          callback(el.value);
        }
      }
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
    callback && callback(event.target.value);
  }
  window.addEventListener("keydown", keyListener, true);
  window.addEventListener("keyup", keyListener, true);
}
export default init;
