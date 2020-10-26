export default class Player {

  id = ''
  name = ''
  width = 40
  height = 55
  direction = 'right'

  movingRight = false
  movingLeft = false

  positionX = 0
  positionY = 0
  jumping = false

  maxVelocityY = 25
  accelerationX = 0.9
  velocityX = 0
  velocityY = 0

  constructor(user) {
    this.id = user.id
    this.name = user.username
    this.positionX = user.x || 400
    this.positionY = user.y || 450
  }

  get id() {
    return this.id
  }

  get name() {
    return this.name
  }

  set name(name) {
    this.name = name
  }

  set positionX(x) {
    this.positionX = x
  }

  set positionY(y) {
    this.positionY = y
  }

  moveRight() {
    this.direction = 'right'
    this.movingRight = true
  }

  moveLeft() {
    this.direction = 'left'
    this.movingLeft = true
  }

  jump() {
    if (!this.jumping) {
      this.jumping = true,
      this.velocityY = -this.maxVelocityY
    }
  }

  stopRight() {
    this.movingRight = false
  }

  stopLeft() {
    this.movingLeft = false
  }

  draw(ctx) {
    const playerSprite = this.direction === 'right'
      ? document.getElementById("player-right-stationary")
      : document.getElementById("player-left-stationary")
    
    ctx.drawImage(playerSprite, this.positionX, this.positionY, this.width, this.height)
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.fillText(this.name, this.positionX + this.width / 2, this.positionY + this.height + 15)
  }

  async update(canvasWidth) {
    if (this.movingRight)  this.velocityX += this.accelerationX
    if (this.movingLeft)   this.velocityX -= this.accelerationX

    this.velocityY += 1.5
    this.positionX += this.velocityX
    this.positionY += this.velocityY
    this.velocityX *= 0.9

    // Update DB
    // if (this.movingRight || this.movingLeft || this.jumping) {
    //   try {
    //     await supabase
    //       .from('users')
    //       .update({
    //         x: this.positionX,
    //         y: this.positionY
    //       })
    //       .eq('id', this.id)
    //   } catch (error) {
    //     console.error('Update fail', error)
    //   }
    // }

    // Collision detect against side walls
    if (this.positionX < 0) {
      this.positionX = canvasWidth - this.width
    }

    if (this.positionX + this.width > canvasWidth) {
      this.positionX = 0
    }

    // Collision detect against bottom wall
    if (this.positionY > 450) {
      this.jumping = false
      this.positionY = 450
      this.velocityY = 0
    }
  }
}