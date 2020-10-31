// Somehow I can't do a import {keyDownListener, keyUpListener} from '@/utils/inputHandler.js' on netlify

export const keyDownListener = (event, player) => {
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

export const keyUpListener = (event, player) => {
  switch(event.key) {
    case 'd':
      player.stopRight()
      break;
    case 'a':
      player.stopLeft()
      break;
  }
}