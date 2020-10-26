<template>
  <div class="w-64">
    <SignUpForm
      :username="username"
      :email="email"
      :password="password"
      :loading="loggingIn"
      @updateUsername="updateUsername"
      @updateEmail="updateEmail"
      @updatePassword="updatePassword"
      :onSignUp="signUp"
      :toggleState="toggleState"
      v-if="type === 'signUp'"
    />
    <LoginForm 
      :email="email"
      :password="password"
      :loading="loggingIn"
      :onLogin="login" 
      :toggleState="toggleState"
      @updateEmail="updateEmail"
      @updatePassword="updatePassword"
      v-else-if="type === 'login'"
    />
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue'
import SignUpForm from '@/components/SignUpForm.vue'

export default {
  name: 'Login',
  components: {
    LoginForm,
    SignUpForm,
  },
  data() {
    return {
      type: 'login',
      loggingIn: false,
      email: '',
      username: '',
      password: '',
    }
  },
  methods: {
    updateUsername(username) {
      this.username = username
    },
    updateEmail(email) {
      this.email = email
    },
    updatePassword(password) {
      this.password = password
    },
    validateForm() {
      if (this.type === 'signUp' && this.username.length === 0) {
        console.error("Username required")
        return false
      }
      if (this.email.length === 0) {
        console.error("Email required")
        return false
      }
      if (this.password.length === 0) {
        console.error("Password required")
        return false
      }
      return true
    },
    login: async function() {
      if (this.validateForm()) {
        this.loggingIn = true
        try {
          const { body: { user } } = await this.$supabase.auth.login(this.email, this.password)
          if (user) {
            await this.storeSession(user.id, user.email)
            this.$router.push({ path: 'room' })
          }
        } catch (error) {
          console.error('error', error)
          alert(error.error_description || error)
        }
        this.loggingIn = false
      }
    },
    signUp: async function() {
      if (this.validateForm()) {
        this.loggingIn = true
        try {
          const { body: { user } } = await this.$supabase.auth.signup(this.email, this.password)
          if (user) {
            await this.storeSession(user.id, user.email, this.username)
            this.$router.push({ path: 'room' })
          }
        } catch (error) {
          console.log('error', error)
          alert(error.error_description || error)
        }
        this.loggingIn = false
      }
    },
    toggleState: function(state) {
      this.type = state
      this.email = ''
      this.username = ''
      this.password = ''
    },
    storeSession: async function(id, email, username = '') {
      try {
        let { body } = await this.$supabase.from('users').match({ email }).select('id, username')
        const existing = body[0]
        const { body: user } = existing?.id
          ? await this.$supabase.from('users').update({ id, email }).match({ id }).single()
          : await this.$supabase.from('users').insert([{ id, email, username }]).single()
        localStorage.setItem('sb-mog', user.id)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>