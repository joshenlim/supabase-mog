<template>
  <div class="flex flex-col items-center">
    <div class="flex flex-col w-full mb-10">
      <div class="mb-5">
        <label for="first_name" class="block text-sm font-medium leading-5 text-gray-100">Email</label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <input
            class="rounded-md py-2 px-4 block w-full bg-transparent border border-teal-600 outline-none"
            :value="email"
            @input="onUpdateEmail"
          />
        </div>
      </div>
      <div>
        <label for="first_name" class="block text-sm font-medium leading-5 text-gray-100">Password</label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <input
            class="rounded-md py-2 px-4 block w-full bg-transparent border border-teal-600 outline-none"
            type="password"
            :value="password"
            @input="onUpdatePassword"
          />
        </div>
      </div>
    </div>
    <div
      class="flex items-center justify-center h-10 text-center shadow-md rounded-full mb-5 transition-all duration-200 ease-in-out"
      v-bind:class="{ 'w-10 bg-teal-800': loading, 'w-48 bg-teal-600 hover:bg-teal-500 cursor-pointer': !loading }"
      v-on:click="onLogin"
    >
      <img alt="loading" v-if="loading" class="animate-spin w-5 h-5" src="@/assets/icons/loader.svg">
      <span v-else>Login</span>
    </div>
    <div
      class="text-sm cursor-pointer transition duration-200 ease-in-out opacity-50 hover:opacity-75"
      v-on:click="toggleState('signUp')"
    >
      I'm a new user
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  props: ['toggleState', 'onLogin', 'email', 'password', 'loading'],
  methods: {
    onUpdateEmail(e) {
      this.$emit('updateEmail', e.target.value)
    },
    onUpdatePassword(e) {
      this.$emit('updatePassword', e.target.value)
    },
  }
}
</script>