<template>
  <div class="flex flex-row h-screen justify-center">
    <div class="w-1/6 border-2 border-black h-full flex flex-col p-2">
      <h2 class="text-lg">Choose a text to practice with:</h2>
      <p
        class="underline text-listing cursor-pointer my-2"
        v-for="(t, i) in text"
        :key="i"
        @click="currentText = i"
      >
        {{ t.substring(0, 100) }}
      </p>
    </div>
    <div class="h-full flex flex-col justify- w-1/2">
      <div class="h-full bg-amber-100 overflow-y-auto p-2">
        <p>{{ currentText }}</p>
      </div>
      <div class="h-full bg-amber-200">
        <textarea
          class="resize-none m-2"
          style="width: calc(100% - 1rem); height: calc(100% - 1rem)"
          placeholder="copy the above text here..."
          autocomplete="off"
        ></textarea>
      </div>
      <div
        class="
          h-[140px]
          bg-amber-100
          flex flex-row
          overflow-hidden
          justify-start
          items-center
        "
      >
        <div
          v-for="(cs, i) in nextChars"
          :key="i"
          :style="{ backgroundColor: cs.spaceHeld ? 'red' : 'green' }"
          class="flex flex-row h-full items-center"
        >
          <div
            v-for="(c, j) in cs.letters"
            :key="j"
            class="
              bg-white
              border-black border-2
              rounded-md
              text-center
              p-2
              m-4
              h-[30px]
              relative
              flex flex-row
              items-center
            "
            :class="c.length == 1 ? 'w-[30px]' : 'w-[80px]'"
          >
            <span class="floatingspan">{{ c }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import text from "~/scripts/text.json";
import init from "~/scripts/htmlInputSwitch.js";
import { fingers } from "~/scripts/keymap.js";
import { keymap } from "../scripts/keymap";
export default {
  data() {
    return { text, currentTextIndex: 0, whatTheyTyped: "", rightHand: true };
  },
  mounted() {
    init((newTyped) => {
      this.whatTheyTyped = newTyped;
    });
  },
  computed: {
    currentText() {
      return this.text[this.currentTextIndex];
    },
    posInText() {
      return this.whatTheyTyped.length;
    },
    nextChars() {
      const howMany = 15;
      const letters = Array.from(
        this.currentText.substring(this.posInText, this.posInText + howMany)
      ).map((l) => l.toLowerCase());
      const getNeedSpace = (l) =>
        l != " " &&
        (!(l in fingers) ||
          (this.rightHand && fingers[l] < 5) ||
          (!this.rightHand && fingers > 4));
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
    },
  },
};
</script>

<style lang="css" scoped>
* {
  box-sizing: border-box;
}
.text-listing {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.floatingspan {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
