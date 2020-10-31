export default class Player {

  id = ''
  name = ''
  width = 40
  height = 55
  floorLimit = 450
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

  set floorLimit(y) {
    this.floorLimit = y
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

  updatePosition(x, y, direction) {
    this.positionX = x
    this.positionY = y
    this.direction = direction
  }

  async update(canvasWidth, supabase) {
    if (this.movingRight)  this.velocityX += this.accelerationX
    if (this.movingLeft)   this.velocityX -= this.accelerationX

    this.velocityY += 1.5
    this.positionX += this.velocityX
    this.positionY += this.velocityY
    this.velocityX *= 0.9

    // Collision detection against side walls
    if (this.positionX < 0) {
      this.positionX = canvasWidth - this.width
    }

    if (this.positionX + this.width > canvasWidth) {
      this.positionX = 0
    }

    // Collision detection against bottom wall
    if (this.positionY > this.floorLimit) {
      this.jumping = false
      this.positionY = this.floorLimit
      this.velocityY = 0
    }

    // Update DB
    if (Math.abs(this.velocityX) > 0.1 || Math.abs(this.velocityY) > 1.5) {
      try {
        await supabase
          .from('users')
          .update({
            x: this.positionX,
            y: this.positionY,
            direction: this.direction,
          })
          .eq('id', this.id)
      } catch (error) {
        console.error('Update fail', error)
      }
    }
  }
}