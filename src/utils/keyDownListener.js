const keyDownListener = (event, player) => {
  if (event.repeat) return
  switch(event.key) {
    case 'd':
      player.moveRight()
      break;
    case 'a':
      player.moveLeft()
      break;
    case 'w':
      player.jump()
      break;
  }
}

export default keyDownListener