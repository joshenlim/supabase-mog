export const keyDownListener = (event, player) => {
  if (event.repeat) return
  switch(event.key) {
    case 'd':
      player.moveRight()
      break;
    case 'a':
      player.moveLeft()
      break;
    case ' ':
      player.jump()
      break;
  }
}

export const keyUpListener = (event, player) => {
  switch(event.key) {
    case 'd':
      if (player.velocityX > 0) player.stop()
      break;
    case 'a':
      if (player.velocityX < 0) player.stop()
      break;
  }
}