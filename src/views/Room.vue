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
import { keyDownListener, keyUpListener } from '@/utils/InputHandler'
import Player from '@/utils/Player'
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

      player: new Player(localStorage.getItem('sb-mog'))
    }
  },
  created() {
    window.addEventListener('keydown', keyDownHandler(this.player), false)
    window.addEventListener('keyup', keyUpHandler(this.player), false)
    window.addEventListener('beforeunload', this.handleCloseBrowser, false)
  },
  async mounted() {
    this.canvas = document.getElementById("game")
    this.ctx = this.canvas.getContext("2d")

    await this.$supabase
      .from('users')
      .update({ status: 'ONLINE' })
      .eq('id', this.player.id)

    const { body: users } = await this.$supabase.from('users')
      .select('*')
      .eq('id', this.player.id)
    
    this.player.name = users[0].username
    this.player.positionX = users[0].x
    this.player.positionY = users[0].y

    // Start subscribing to changes on the users table

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
      this.player.draw(this.ctx)
    },
    gameUpdate: function() {
      this.player.update(this.ctx)
    },
    gameLoop: function() {
      this.gameUpdate()
      this.gameDraw()
      requestAnimationFrame(this.gameLoop)
    },
    handleCloseBrowser: async function() {
      await this.$supabase
        .from('users')
        .update({ status: 'OFFLINE' })
        .eq('id', this.player.id)
    }
  }
}
</script>

<style scoped>
img {
  display: none
}
</style>