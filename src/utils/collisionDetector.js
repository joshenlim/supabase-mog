const detectCollision = (player, platform) => {
  const platformTop = platform.positionY
  const platformLeft = platform.positionX
  const platformRight = platform.positionX + platform.width

  const playerBottom = player.positionY + player.height
  const playerLeft = player.positionX
  const playerRight = player.positionX + player.width

  if (
    playerBottom <= platformTop && 
    playerRight >= platformLeft && 
    playerLeft <= platformRight
  ) {
    return true
  } else {
    return false
  }
}

export default detectCollision