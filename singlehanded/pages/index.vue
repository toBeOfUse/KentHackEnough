<template>
  <div class="flex flex-col p-5 max-w-xl m-auto">
    <h1 class="text-3xl my-4">One-Handed Typing for the Masses</h1>
    <p>
      Hello. A month ago, after breaking my arm, I suddenly found typing a lot
      more difficult. There were surprisingly few resources available online to
      help me.
    </p>
    <p>
      <a
        href="https://blog.xkcd.com/2007/08/14/mirrorboard-a-one-handed-keyboard-layout-for-the-lazy/"
        target="_blank"
        >This</a
      >
      blog post from Randall Munroe of xkcd inspired me to implement a keyboard
      layout that lets you switch what keys are available to you on the fly,
      letting you reach the whole alphabet with the fingers of just one hand,
      including a configuration file that lets you use it with some Linux input
      methods.
      <em
        >The goal of this website is to bring this functionality to the
        masses.</em
      >
    </p>
    <p>
      The crux of this input method is this:
      <strong>while you hold space, the keyboard is mirrored.</strong> This
      allows you to seamlessly switch your muscle memory so that your left pinky
      can take over from your right pinky, or vice versa, and for the other
      fingers too. <em>It's less weird than it sounds.</em>
    </p>
    <ul class="list-disc px-8">
      <li><a href="/wordprocessor">Try it in-browser.</a></li>
      <li>
        <a href="/singlehanded.exe">Download it as a Windows executable.</a>
        <span class="text-xs"
          >(Your antivirus might try to block it, sorry)</span
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "IndexPage",
};
</script>

<style scoped>
p {
  display: block;
  margin: 5px 0;
}
a {
  text-decoration: underline;
}
</style>
