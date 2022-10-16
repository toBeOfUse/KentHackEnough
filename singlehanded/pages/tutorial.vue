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
    <div class="h-full flex flex-col w-1/2">
      <div class="h-[40%] bg-amber-100 overflow-y-auto p-2">
        <p>{{ text[currentText] }}</p>
      </div>
      <div class="h-[40%] bg-amber-200">
        <textarea
          class="resize-none m-2"
          style="width: calc(100% - 1rem); height: calc(100% - 1rem)"
          placeholder="copy the above text here..."
        ></textarea>
      </div>
      <div class="h-[20%] bg-amber-100"></div>
    </div>
  </div>
</template>

<script>
import text from "~/scripts/text.json";
import init from "~/scripts/htmlInputSwitch.js";
export default {
  data() {
    return { text, currentText: 0 };
  },
  mounted() {
    init();
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
</style>
