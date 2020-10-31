import detectCollision from '@/utils/collisionDetector.js'

export default class Platform {

  id = null
  x = 0
  y = 0
  width = 150
  height = 40

  constructor(id, x, y) {
    this.id = id
    this.positionX = x
    this.positionY = y
  }

  draw(ctx) {
    const platformSprite = document.getElementById("platform")
    ctx.drawImage(platformSprite, this.positionX, this.positionY, this.width, this.height)
  }

  update(player) {
    if (detectCollision(player, this)) {
      player.floorLimit = this.positionY - this.height - 15
      return true
    } else {
      player.floorLimit = 450
      return false
    }
  }
}