<template>
  <div class="flex flex-col p-5 max-w-lg m-auto max-h-screen">
    <h1 class="text-2xl font-bold inline">One-Handed Word Processor</h1>
    <span class="text-sm underline"><a href="/">(go back home)</a></span>
    <div class="block my-4 flex flex-col flex-shrink overflow-y-auto relative">
      <div class="p-2 border-2 rounded-lg border-black">
        <div class="flex flex-row">
          <button @click="editor && editor.chain().focus().toggleBold().run()">
            <strong>B</strong>
          </button>
          <button
            @click="editor && editor.chain().focus().toggleItalic().run()"
          >
            <em>I</em>
          </button>
          <button
            class="underline"
            @click="editor && editor.chain().focus().toggleUnderline().run()"
          >
            U
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          >
            H1
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          >
            H2
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          >
            H3
          </button>
        </div>
        <client-only>
          <editor-content :editor="editor" />
        </client-only>
      </div>
    </div>
    <keyboard-graphic width="100%" height="auto" class="my-2 shrink-0" />
  </div>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-2";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { keymap } from "../scripts/keymap.js";
import KeyboardGraphic from "~/assets/keyboard.vue.svg";

export default {
  components: {
    EditorContent,
    KeyboardGraphic,
  },

  data() {
    return {
      editor: null,
    };
  },

  mounted() {
    this.editor = new Editor({
      content: `<h1>Try it out!</h1><p>This text editor will let you practice your one-handed typing skills.
        Remember, as you hold space, the keyboard is mirrored and the letters you would normally type with your
        left hand should now be typed with your right - and vice versa. The mirrored layout means that you will
        transfer your muscle memory from e.g. your left pinky to your right pinky - surprisingly smoothly.
        With the graphic below, you can see how the keys change while you type.</p>
        <p>Try typing some text underneath here:</p><p></p>`,
      extensions: [StarterKit, Underline],
    });

    const type = (text) => {
      if (this.editor.isFocused) this.editor.commands.insertContent(text);
    };

    const backspace = () => {
      const cursorPos = this.editor.view.state.selection.from;
      this.editor.commands.setTextSelection({
        from: cursorPos - 1,
        to: cursorPos,
      });
      this.editor.commands.deleteSelection();
    };

    const sheet = document.createElement("style");
    document.head.appendChild(sheet);
    const pressedKeys = new Set();

    const setKeyboardStyle = () => {
      let style = "#g2221 {fill: white;} ";
      style += "#g2206 {fill: white;} ";
      style += "#g2193 {fill: white;} ";
      style += "#g2235 {fill: white;} ";
      style += "#rect950 {fill:inherit;} ";
      if (pressedKeys.has(" ")) style += "#normalLetterGroup {opacity: 0.3;} ";
      else style += "#mirrorLetterGroup {opacity: 0.3;} ";
      const aliases = {
        ";": "semicolon",
        ".": "period",
        ",": "comma",
        "[": "openbracket",
      };
      for (const key of pressedKeys) {
        if (key in aliases || key.match(/[a-z]/i)) {
          const key_name = aliases[key] || key;
          style += "#" + key_name + " {fill: darkgray;} ";
        }
      }
      sheet.innerHTML = style;
    };

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
          type(" ");
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
          type(keymap[event.key]);
        } else {
          type(event.key);
        }
      }
      if (event.type == "keydown") {
        pressedKeys.add(event.key);
      } else {
        pressedKeys.delete(event.key);
      }
      setKeyboardStyle();
    }
    window.addEventListener("keydown", keyListener, true);
    window.addEventListener("keyup", keyListener, true);
    setKeyboardStyle();
  },

  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>

<style scoped>
button {
  background-color: lightgray;
  border-radius: 3px;
  margin: 2px;
  padding: 2px;
  border: 1px solid black;
  min-width: 25px;
  text-align: center;
}
button:first-of-type {
  margin-left: 0px;
}
button:nth-of-type(3) {
  margin-right: 12px;
}
</style>

<style>
.ProseMirror {
  width: 100%;
  min-height: 200px;
  padding: 8px;
  margin-top: 4px;
}
.ProseMirror h1 {
  font-size: 150%;
}
.ProseMirror h2 {
  font-size: 130%;
}
.ProseMirror h3 {
  font-size: 110%;
}
.ProseMirror p {
  margin: 5px 0;
}
</style>
