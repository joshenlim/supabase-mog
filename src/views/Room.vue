<template>
  <div>
    <img id="player-right-stationary" src="@/assets/player-right-stationary.svg">
    <img id="player-left-stationary" src="@/assets/player-left-stationary.svg">
    <canvas
      class="bg-white"
      id="game"
      :style="{'background-image': 'url(' + background + ')'}"
      :width="canvasWidth"
      :height="canvasHeight"
    />
  </div>
</template>

<script>
import { keyDownListener, keyUpListener } from '@/utils/inputHandler'
import Player from '@/stores/Player'
import backgroundImage from '@/assets/background.png'

const keyDownHandler = function(player) {
  return function(event) { keyDownListener(event, player) }
}

const keyUpHandler = function(player) {
  return function(event) { keyUpListener(event, player) }
}

// Road to multiplayer:
// - [x] Encapsulate player information as a class?
// - Perhaps everything can listen to db changes, even local player?
//    - Actually this might be important, so that updates received by everyone is synced
// - When player comes online
//    - Inject an <img>, identify via id=userid
//    - Room.vue needs to keep a context of players, and constantly draw
// - When player goes offline
//    - Eject <img>, identify via id=userid
// Add a login as different user button as well

export default {
  name: 'Room',
  data() {
    return {
      canvas: null,
      ctx: null,
      canvasWidth: 800,
      canvasHeight: 600,
      background: backgroundImage,
      players: []
    }
  },
  async created() {
    const localPlayerId = localStorage.getItem('sb-mog')
    await this.$supabase
      .from('users')
      .update({ status: 'ONLINE' })
      .eq('id', localPlayerId)

    const { body: users } = await this.$supabase
      .from('users')
      .select('*')
      .eq('status', 'ONLINE')
    
    this.players = users.map(user => new Player(user))

    const [localPlayer] = this.players.filter(player => player.id === localPlayerId)
    window.addEventListener('keydown', keyDownHandler(localPlayer), false)
    window.addEventListener('keyup', keyUpHandler(localPlayer), false)
    window.addEventListener('beforeunload', this.handleCloseBrowser, false)
  },
  async mounted() {
    this.canvas = document.getElementById("game")
    this.ctx = this.canvas.getContext("2d")

    // Start subscribing to changes on the users table
    this.$supabase
      .from('users')
      .on('*', payload => {
        const updatedUser = payload.new
        switch(payload.eventType) {
          case 'UPDATE':
            if (updatedUser.status === 'OFFLINE') this.removeUserFromCanvas(updatedUser)
            else if (updatedUser.status === 'ONLINE') this.updateUserOnCanvas(updatedUser)
            break;
          case 'INSERT':
            break;
        }
        console.log('Payload', updatedUser)
      })
      .subscribe()

    requestAnimationFrame(this.gameLoop)
  },
  beforeDestroy() {
    // Go debug this, event listeners aren't getting removed by low priority
    console.log('on beforeDestroy')
    window.removeEventListener('keydown', keyDownHandler(this.player), false)
    window.removeEventListener('keyup', keyUpHandler(this.player), false)
  },
  methods: {
    gameDraw: function() {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.players.forEach(player => player.draw(this.ctx))
    },
    gameUpdate: function() {
      this.players.forEach(player => player.update(this.canvasWidth))
    },
    gameLoop: function() {
      this.gameUpdate()
      this.gameDraw()
      requestAnimationFrame(this.gameLoop)
    },
    removeUserFromCanvas: function(user) {
      this.players = this.players.filter(player => player.id !== user.id)
    },
    updateUserOnCanvas:function(user) {
      if (this.players.filter(player => player.id === user.id).length === 0) {
        this.players = this.players.concat([new Player(user)])
      }
    },
    handleCloseBrowser: async function() {
      const localPlayerId = localStorage.getItem('sb-mog')
      console.log(`Setting ${localPlayerId} to OFFLINE`)
      await this.$supabase
        .from('users')
        .update({ status: 'OFFLINE' })
        .eq('id', localPlayerId)
    }
  }
}
</script>

<style scoped>
img {
  display: none
}
</style>