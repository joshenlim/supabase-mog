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
import backgroundImage from '@/assets/background.png'

const FLOOR_Y_LIMIT = 450

const keyDownHandler = function(player) {
  return function(event) { keyDownListener(event, player) }
}

const keyUpHandler = function(player) {
  return function(event) { keyUpListener(event, player) }
}

// Road to multiplayer:
// - Encapsulate player information as a class?
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

      // Player information
      player: {
        id: localStorage.getItem('sb-mog'),
        name: null,
        width: 40,
        height: 55,
        direction: 'right',

        positionX: 0,
        positionY: 0,
        jumping: false,
        maxVelocityX: 6,
        maxVelocityY: 25,
        velocityX: 0,
        velocityY: 0,

        moveRight: () => {
          this.player.direction = 'right'
          this.player.velocityX = this.player.maxVelocityX
        },
        moveLeft: () => {
          this.player.direction = 'left'
          this.player.velocityX = -this.player.maxVelocityX
        },
        jump: () => {
          if (!this.player.jumping) {
            this.player.jumping = true,
            this.player.velocityY = -this.player.maxVelocityY
          }
        },
        stop: () => {
          this.player.velocityX = 0
        },
        draw: (ctx) => {
          const playerSprite = this.player.direction === 'right'
            ? document.getElementById("player-right-stationary")
            : document.getElementById("player-left-stationary")

          ctx.drawImage(playerSprite, this.player.positionX, this.player.positionY, this.player.width, this.player.height)
          ctx.font = "12px Arial"
          ctx.textAlign = "center"
          ctx.fillText(this.player.name, this.player.positionX + this.player.width / 2, this.player.positionY + this.player.height + 15)
        },
        update: async() => {

          // if (this.player.velocityX !== 0) {
          //   try {
          //     await this.$supabase
          //       .from('users')
          //       .update({ x: this.player.positionX })
          //       .eq('id', this.player.id)
          //     // If update below is placed before supabase, will be very smooth but wall collision will jitter
          //   } catch (error) {
          //     console.error('Update fail', error)
          //   }
          // }

          this.player.velocityY += 1.5
          this.player.positionX += this.player.velocityX
          this.player.positionY += this.player.velocityY
          // this.player.velocityX *= 0.9

          if (this.player.positionX < 0) {
            this.player.positionX = this.canvasWidth - this.player.width
          }
          if (this.player.positionX + this.player.width > this.canvasWidth) {
            this.player.positionX = 0
          }
          if (this.player.positionY > FLOOR_Y_LIMIT) {
            this.player.jumping = false
            this.player.positionY = FLOOR_Y_LIMIT
            this.player.velocityY = 0
          }
        }
      },
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