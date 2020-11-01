<template>
  <div id="app" class="w-screen h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
    <router-view />
    <a href="https://supabase.io" class="text-xs fixed bottom-0 mb-6 flex items-center justify-center">
      Powered by
      <img id="banner" src="@/assets/supabase.png" class=" ml-2 w-4 h-4">
    </a>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
