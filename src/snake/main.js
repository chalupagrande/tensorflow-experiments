const canvasSize = 200 // number of pixels of each game board
const boardDimension = 10 // number or "squares" in each game board
const scl = canvasSize / boardDimension

let fps = 5

let generationPopSize = 12


// create games and generations
let generation = new Generation(generationPopSize, boardDimension)
generation.init()





// function setup(canvasParentRef) {
//   createCanvas(canvasSize, canvasSize).parent(canvasParentRef)
//   generation = new Generation(2, boardSize)
// }

// function draw() {
//   fps && frameRate(fps)
//   generation.games.forEach((game => {
//     let status = game.step()
//     if (status === -1) {
//       console.log('LOST')
//       // game = new Game(boardSize, boardSize)
//       game.score = 1
//       noLoop()
//     } else if (status === 1) {
//       game.score += 1
//     }
//     drawBoxes(game)
//   }))
// }

// does the drawing
function drawBoxes(ip5, game) {
  ip5.background(100)
  ip5.fill(255)
  ip5.text(`Score: ${game.score}`, 1, 10)
  let snakePos = game.snake.positions
  let applePos = game.baitLocation

  ip5.noStroke()
  snakePos.forEach((pos, i) => {
    ip5.fill(0)
    ip5.rect(pos.x * scl, pos.y * scl, scl, scl)
  })

  ip5.fill(255, 0, 0)
  ip5.rect(applePos.x * scl, applePos.y * scl, scl, scl)

}

// sketch.keyPressed = (e) => {
//   e.preventDefault()
//   if (sketch.keyCode === sketch.LEFT_ARROW) {
//     game.snake.setHeading(-1, 0)
//   } else if (sketch.keyCode === sketch.RIGHT_ARROW) {
//     game.snake.setHeading(1, 0)
//   } else if (sketch.keyCode === sketch.UP_ARROW) {
//     game.snake.setHeading(0, -1)
//   } else if (sketch.keyCode === sketch.DOWN_ARROW) {
//     game.snake.setHeading(0, 1)
//   }
// }