<template>
  <div class="flex flex-col p-5 max-w-xl m-auto">
    <h1 class="text-3xl my-4">One-Handed Typing for the Masses</h1>
    <p>
      Hello. A month ago, after breaking my arm, I suddenly found typing a lot
      more difficult. Naturally, I started scouring the Internet for resources
      that would help me.
    </p>
    <p>
      I honestly didn't find a lot that was for free, but I did come across
      <a
        href="https://blog.xkcd.com/2007/08/14/mirrorboard-a-one-handed-keyboard-layout-for-the-lazy/"
        target="_blank"
        >this</a
      >
      blog post from Randall Munroe of xkcd, describing and providing a Linux
      XInput configuration file for a new, dynamic keyboard layout; one that
      switches keys around in response to your input, putting the whole universe
      of letters into the reach of one single hand.
      <em
        >The goal of this website is to bring this functionality to the
        masses.</em
      >
    </p>
    <p>
      The crux of this input method is this:
      <strong
        >while you hold space, the letters of your keyboard are
        mirrored.</strong
      >
      This allows you to seamlessly switch over your muscle memory so that your
      left pinky can take over from your right pinky, or vice versa, and the
      same for the other kinds of fingers too.
      <em>It's less weird than it sounds.</em> To get a sense of it, you have a
      few different options:
    </p>
    <ul class="list-disc px-8">
      <li><a href="/wordprocessor">Try it right here, in your browser.</a></li>
      <li>
        <a href="/tutorial">Get tutored, by the tutorial.</a>
      </li>
      <li>
        <a href="/fungame">Play the Fun Game.</a>
      </li>
      <li>
        <a href="/singlehanded.exe">Download it as a Windows executable.</a>
        <span class="text-xs"
          >(Your antivirus might try to block it, sorry)</span
        >
      </li>
    </ul>
    <p class="opacity-70 italic text-sm">
      This project was created in 24 hours by Mitch for the Kent State
      University "Kent Hack Enough" hackathon.
    </p>
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
