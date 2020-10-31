const keyUpListener = (event, player) => {
  switch(event.key) {
    case 'd':
      player.stopRight()
      break;
    case 'a':
      player.stopLeft()
      break;
  }
}

export default keyUpListener