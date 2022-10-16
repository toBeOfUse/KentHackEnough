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
        <p>Points: {{ points }}!</p>
        <input type="radio" id="right" :value="true" v-model="rightHand" />
        <label for="right">Use Right Hand</label>
        <br />
        <input type="radio" id="left" :value="false" v-model="rightHand" />
        <label for="left">Use Left Hand</label>
        <span class="text-sm underline block"
          ><a href="/">(go back home)</a></span
        >
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
          text-xl
          flex flex-row
          items-center
        "
      >
        <strong class="mr-8">Oncoming text:</strong> {{ upcomingText }}
      </div>
      <div class="h-full w-full bg-amber-200 relative overflow-hidden">
        <div v-if="intro" id="intro">
          <p>
            This is like a rhythm game where you press the keys that come
            towards your virtual fingers, in order to type the selected text in
            the little text box below. Have fun.
          </p>
          <button @click="startGame">GO</button>
        </div>
        <div
          v-for="shape in activeShapes"
          :key="shape.from"
          :style="{
            ...getShapeGeometry(shape),
            backgroundColor:
              getShapeFractionDone(shape) > 0.9 &&
              !shape.won &&
              !shape.isMeta &&
              !shape.letter == ' ' &&
              !shape.letter == 'space'
                ? 'red'
                : '',
          }"
          :class="
            (shape.column == 0 && rightHand) ||
            (shape.column == 4 && !rightHand)
              ? 'shape'
              : 'key'
          "
        >
          <span class="floatingspan">
            {{
              shape.letter == "space" || shape.letter == " " ? "" : shape.letter
            }}
          </span>
        </div>
        <div class="dest-cont">
          <template v-for="(col, i) in columns">
            <img
              :key="i"
              :src="col.src"
              :style="{
                left: col.pos + '%',
                height: col.height + '%',
                bottom: col.bottom + '%',
              }"
              :id="'dest' + (i + 1)"
            />
            <img
              :key="i + 'sparkle'"
              src="/sparkle.gif"
              :style="{
                left: col.pos + '%',
                height: col.height + '%',
                bottom: col.bottom + '%',
              }"
              :id="'dest' + (i + 1)"
              v-if="sparkleEnds[i] >= elapsedTicks"
            />
          </template>
        </div>
      </div>
      <div class="w-full bg-amber-100 h-12">
        <input
          class="resize-none m-2 text-lg p-2"
          style="width: calc(100% - 1rem); height: calc(100% - 1rem)"
          placeholder="to play, type the indicated letters here!"
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
    secondsPerTick: 2,
    ticksBetweenLetters: 0.75,
    timerStartedAt: -1,
    currentTimer: -1,
    timerID: -1,
    letterDuration: 0.08,
    spaceBeforeLetter: 0.4,
    sparkleEnds: [-1, -1, -1, -1, -1],
    points: 0,
    intro: true,
  }),
  mounted() {
    init((result, spacePressed, key, eventType) => {
      if (eventType == "keyup") {
        return;
      }
      for (const s of this.scorableShapes) {
        if (s.letter == key && (spacePressed || !s.needsSpace)) {
          this.sparkleEnds[s.column] = this.elapsedTicks + 0.5;
          this.points += 1;
          s.won = true;
        }
      }
    });
    window.stopTimer = () => clearInterval(this.timerID);
    this.$refs.typingArea.focus();
  },
  methods: {
    startGame() {
      this.intro = false;
      this.startTimer();
      this.$refs.typingArea.focus();
    },
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
    getShapeFractionDone(shape) {
      return this.elapsedTicks - shape.contactTime - 1;
    },
    getShapeGeometry(shape) {
      const fractionDone = this.getShapeFractionDone(shape);
      const cols = this.columns.map((c) => c.pos);
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
    columns() {
      if (this.rightHand) {
        return [
          {
            pos: 15,
            height: 5,
            bottom: 15,
            src: "/spacebar.svg",
          },
          { pos: 45, height: 20, bottom: 0, src: "/finger.svg" },
          { pos: 60, height: 20, bottom: 0, src: "/finger.svg" },
          { pos: 75, height: 20, bottom: 0, src: "/finger.svg" },
          { pos: 90, height: 20, bottom: 0, src: "/finger.svg" },
        ];
      } else {
        return [
          { pos: 10, height: 20, bottom: 0, src: "/finger.svg" },
          { pos: 25, height: 20, bottom: 0, src: "/finger.svg" },
          { pos: 40, height: 20, bottom: 0, src: "/finger.svg" },
          { pos: 55, height: 20, bottom: 0, src: "/finger.svg" },
          {
            pos: 85,
            height: 5,
            bottom: 15,
            src: "/spacebar.svg",
          },
        ];
      }
    },
    currentText() {
      return this.text[this.currentTextIndex];
    },
    currentTextPos() {
      let count = 0;
      for (const shape of this.shapes) {
        if (this.getShapeFractionDone(shape) > 1) {
          if (!shape.isMeta) {
            count += 1;
          }
        } else {
          break;
        }
      }
      return count;
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
    scorableShapes() {
      return this.activeShapes.filter((s) => {
        const f = this.getShapeFractionDone(s);
        return f > 0.75 && f < 0.95;
      });
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
            isMeta: true,
            column: this.rightHand ? 0 : 4,
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
          let column;
          if (this.rightHand) {
            if (l == " " || l == "space") {
              column = 0;
            } else {
              const colMap = { 1: 4, 2: 3, 3: 2, 4: 1, 5: 1, 6: 2, 7: 3, 8: 4 };
              column = colMap[fingers[l]];
            }
          } else {
            if (l == " " || l == "space") {
              column = 4;
            } else {
              const colMap = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 3, 6: 2, 7: 1, 8: 0 };
              column = colMap[fingers[l]];
            }
          }
          if (column === undefined) {
            console.error("undef");
          }
          shapes.push({
            isMeta: false,
            contactTime: from,
            length: this.letterDuration,
            letter: l,
            column,
            needsSpace: seq.spaceHeld,
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
      this.sparkleEnds = [-1, -1, -1, -1, -1];
      this.$refs.typingArea.value = "";
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
  /* bottom: 0; */
  transform: translateX(-50%);
}
#intro {
  position: absolute;
  width: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 10px;
  border-radius: 5px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
#intro button {
  background-color: lightgray;
  border-radius: 3px;
  border: 1px solid black;
  padding: 3px;
  margin: 5px 0;
}
/* #dest1 {
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
} */
.floatingspan {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
