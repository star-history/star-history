<template>
  <div
    class="relative w-full shrink-0 h-auto mt-6 flex flex-col justify-end items-center"
  >
    <div
      class="w-full py-2 px-3 md:w-5/6 lg:max-w-7xl flex flex-row flex-wrap justify-between items-center text-neutral-700 border-t"
    >
      <div
        class="text-sm leading-8 flex flex-row flex-wrap justify-start items-center"
      >
        <h1 class="h-full text-gray-600">
          The missing GitHub star history graph
        </h1>
        <a
          class="h-full flex flex-row justify-center items-center ml-3 text-lg hover:opacity-80"
          href="https://twitter.com/StarHistoryHQ"
          target="_blank"
        >
          <i class="fab fa-twitter"></i>
        </a>
        <a
          class="h-full flex flex-row justify-center items-center mx-3 text-lg hover:opacity-80"
          href="mailto:star@bytebase.com"
          target="_blank"
        >
          <i class="fas fa-envelope"></i>
        </a>
        <a
          class="h-full flex flex-row justify-center items-center mr-3 text-lg hover:opacity-80"
          href="https://github.com/star-history/star-history"
          target="_blank"
        >
          <i class="fab fa-github"></i>
        </a>
      </div>
      <div class="flex flex-row flex-wrap items-center space-x-4">
        <div
          class="flex flex-row text-sm leading-8 underline text-blue-700 hover:opacity-80"
        >
          <img class="h-6 mt-1 mr-2" src="/sqlchat.webp" />
          <a href="https://sqlchat.ai" target="_blank"> SQL Chat </a>
        </div>
        <div
          class="flex flex-row text-sm leading-8 underline text-blue-700 hover:opacity-80"
        >
          <img class="h-6 mt-1 mr-2" src="/dbcost.webp" />
          <a href="https://dbcost.com" target="_blank">DB Cost</a>
        </div>
      </div>
      <div
        class="text-xs leading-8 flex flex-row flex-nowrap justify-end items-center"
      >
        <span class="text-gray-600">
          Maintained by
          <a
            class="text-blue-500 font-bold hover:opacity-80"
            href="https://bytebase.com"
            target="_blank"
            >Bytebase</a
          >, originally built by
          <a
            class="bg-blue-400 text-white p-1 pl-2 pr-2 rounded-l-2xl rounded-r-2xl hover:opacity-80"
            href="https://twitter.com/tim_qian"
            target="_blank"
          >
            @tim_qian
          </a>
        </span>
      </div>
    </div>
  </div>
</template>
