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
      <div
        class="
          h-1/6
          w-full
          bg-amber-100
          overflow-hidden
          whitespace-nowrap
          p-2
          text-lg
          flex flex-row
          items-center
          pl-32
        "
      >
        {{ upcomingText }}
      </div>
      <div class="h-full w-full bg-amber-200 relative overflow-hidden">
        <div
          v-for="shape in activeShapes"
          :key="shape.from"
          :style="getShapeGeometry(shape)"
          :class="shape.column == 0 ? 'shape' : 'key'"
        >
          <span class="floatingspan">
            {{
              shape.letter == "space" || shape.letter == " " ? "" : shape.letter
            }}
          </span>
        </div>
        <div class="dest-cont">
          <img src="spacebar.svg" id="dest1" />
          <img src="finger.svg" id="dest2" />
          <img src="finger.svg" id="dest3" />
          <img src="finger.svg" id="dest4" />
          <img src="finger.svg" id="dest5" />
        </div>
      </div>
      <div class="w-full bg-amber-100">
        <input
          class="resize-none m-2"
          style="width: calc(100% - 1rem); height: calc(100% - 1rem)"
          placeholder="enter your letters here!"
          autocomplete="off"
          ref="typingArea"
        />
      </div>
    </div>
  </div>
</template>

<script>
import text from "~/scripts/text.js";
import { sequences as getSequences } from "~/scripts/stringdissection.js";
import init from "~/scripts/htmlInputSwitch.js";
import { fingers } from "~/scripts/keymap.js";
export default {
  data: () => ({
    text,
    rightHand: true,
    currentTextIndex: 0,
    currentTextPos: 0,
    secondsPerTick: 1.5,
    ticksBetweenLetters: 1,
    timerStartedAt: -1,
    currentTimer: -1,
    timerID: -1,
    letterDuration: 0.08,
    spaceBeforeLetter: 0.4,
  }),
  mounted() {
    init();
    this.startTimer();
    window.stopTimer = () => clearInterval(this.timerID);
  },
  methods: {
    startTimer() {
      this.timerStartedAt = Date.now();
      this.currentTimer = Date.now();
      this.timerID = setInterval(() => {
        this.currentTimer = Date.now();
      }, 20);
    },
    stopTimer() {
      clearInterval(this.timerID);
    },
    getShapeGeometry(shape) {
      const fractionDone = this.elapsedTicks - shape.contactTime - 1;
      const cols = [15, 45, 60, 75, 90];
      const heightPercent = shape.length * 100;
      return {
        top: fractionDone * 100 - heightPercent + "%",
        left: cols[shape.column] + "%",
        transform: "translateX(-50%)",
        height: heightPercent + "%",
        width: "8%",
      };
    },
  },
  computed: {
    currentText() {
      return this.text[this.currentTextIndex];
    },
    upcomingText() {
      return this.currentText.substring(
        this.currentTextPos,
        this.currentTextPos + 100
      );
    },
    elapsedTicks() {
      const elapsedSeconds = (this.currentTimer - this.timerStartedAt) / 1000;
      return elapsedSeconds / this.secondsPerTick;
    },
    activeInterval() {
      return [this.elapsedTicks - 5, this.elapsedTicks + 5];
    },
    activeShapes() {
      const interval = this.activeInterval;
      return this.shapes.filter((s) => {
        return (
          (s.contactTime > interval[0] && s.contactTime < interval[1]) ||
          (s.contactTime + s.length > interval[0] &&
            s.contactTime + s.length < interval[1])
        );
      });
    },
    shapes() {
      const shapes = [];
      const sequences = getSequences(this.currentText, this.rightHand);
      let from = 1;
      for (const seq of sequences) {
        if (seq.spaceHeld) {
          shapes.push({
            column: 0,
            contactTime: from - this.spaceBeforeLetter,
            length:
              from +
              this.letterDuration +
              this.ticksBetweenLetters * (seq.letters.length - 1) +
              this.spaceBeforeLetter -
              (from - this.spaceBeforeLetter),
            letter: " ",
          });
        }
        for (const l of seq.letters) {
          shapes.push({
            contactTime: from,
            length: this.letterDuration,
            letter: l,
            column:
              l == "space"
                ? 0
                : fingers[l] > 4
                ? fingers[l] - 4
                : 4 - fingers[l],
          });
          from += this.ticksBetweenLetters;
        }
      }
      return shapes;
    },
  },
  watch: {
    currentTextIndex() {
      this.startTimer();
    },
  },
};
</script>

<style scoped>
.text-listing {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.shape {
  position: absolute;
  background-color: blue;
  opacity: 0.5;
}
.key {
  position: absolute;
  background-color: white;
  border: 1px solid black;
  border-radius: 3px;
}
.dest-cont img {
  position: absolute;
  bottom: 0;
  transform: translateX(-50%);
}
#dest1 {
  left: 15%;
  height: 5%;
  bottom: 15%;
}
#dest2 {
  left: 45%;
  height: 20%;
}
#dest3 {
  left: 60%;
  height: 20%;
}
#dest4 {
  left: 75%;
  height: 20%;
}
#dest5 {
  left: 90%;
  height: 20%;
}
.floatingspan {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
