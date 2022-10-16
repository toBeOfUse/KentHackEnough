<template>
  <div class="flex flex-row h-screen justify-center">
    <div class="w-1/6 border-2 border-black h-full flex flex-col p-2">
      <h2 class="text-lg">Choose a text to practice with:</h2>
      <div class="h-full overflow-y-auto">
        <p
          class="underline text-listing cursor-pointer my-2"
          v-for="(t, i) in text"
          :key="i"
          @click="currentTextIndex = i"
        >
          {{ t.substring(0, 100) }}
        </p>
      </div>
      <div class="w-full">
        <input type="radio" id="right" :value="true" v-model="rightHand" />
        <label for="right">Use Right Hand</label>
        <br />
        <input type="radio" id="left" :value="false" v-model="rightHand" />
        <label for="left">Use Left Hand</label>
      </div>
    </div>
    <div class="h-full flex flex-col w-1/2">
      <div class="h-full bg-amber-100 overflow-y-auto p-2">
        <p>
          <span
            v-for="(c, i) in Array.from(currentText)"
            :class="
              i < whatTheyTyped.length &&
              !spaceDown &&
              whatTheyTyped.charAt(i) != c
                ? 'text-red-400'
                : i < posInText
                ? 'opacity-40'
                : ''
            "
            :key="i"
            >{{ c }}</span
          >
        </p>
      </div>
      <div class="h-full bg-amber-200">
        <textarea
          class="resize-none m-2"
          style="width: calc(100% - 1rem); height: calc(100% - 1rem)"
          placeholder="copy the above text here..."
          autocomplete="off"
          ref="typingArea"
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
          v-for="(cs, i) in nextSequences"
          :key="i"
          class="flex flex-row h-full items-center relative"
        >
          <div
            v-for="(c, j) in cs.letters"
            :key="j"
            style="transform: translateY(-5px)"
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
          <div v-if="cs.spaceHeld" class="lower-bracket" />
          <div v-if="cs.spaceHeld" class="lower-space" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import text from "~/scripts/text.js";
import init from "~/scripts/htmlInputSwitch.js";
import { sequences } from "~/scripts/stringdissection.js";
export default {
  data() {
    return {
      text,
      currentTextIndex: 0,
      whatTheyTyped: "",
      rightHand: true,
      tickerLength: 15,
      spaceDown: false,
    };
  },
  mounted() {
    init((newTyped, spaceDown) => {
      this.whatTheyTyped = newTyped;
      this.spaceDown = spaceDown;
    });
  },
  watch: {
    currentTextIndex() {
      this.$refs.typingArea.value = "";
    },
  },
  computed: {
    currentText() {
      return this.text[this.currentTextIndex];
    },
    posInText() {
      if (this.spaceDown && this.whatTheyTyped.slice(-1) == " ") {
        return this.whatTheyTyped.length - 1;
      } else {
        return this.whatTheyTyped.length;
      }
    },
    nextChars() {
      return Array.from(
        this.currentText.substring(
          this.posInText,
          this.posInText + this.tickerLength
        )
      ).map((l) => l.toLowerCase());
    },
    nextSequences() {
      const letters = this.nextChars;
      return sequences(letters, this.rightHand);
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
.lower-bracket {
  position: absolute;
  width: calc(100% - 20px);
  height: 5px;
  left: 10px;
  bottom: 10px;
  border-left: 2px solid black;
  border-bottom: 2px solid black;
  border-right: 2px solid black;
}
.lower-space {
  position: absolute;
  width: 30px;
  height: 10px;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border: 2px solid black;
  border-radius: 3px;
}
</style>
