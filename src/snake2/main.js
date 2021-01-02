const populationSize = 12 //number of gameboards
const sketchBoardSize = 200 //size in pixels for canvas
const gameWidthInSquares = 10 //number of squares
const fps = 3

let epochs = 10
const ctx = {
  w: sketchBoardSize,
  h: sketchBoardSize,
  rows: gameWidthInSquares,
  cols: gameWidthInSquares,
  fps: fps,
  scl: sketchBoardSize / gameWidthInSquares,
  populationSize,
  sightSize: 5,
  snakeLife: 50,
  nnHiddenNodes: 4,
  nnHiddenLayers: 1,
  nnActivationFunc: 'relu',
  nnLearningRate: 0.2,
  nnOptimizer: 'sgd',
  nnLoss: 'meanSquaredError'
}


let generation = new Generation(ctx)
const playBtn = document.getElementById('play').addEventListener('click', ()=> generation.play())
const pauseBtn = document.getElementById('pause').addEventListener('click', ()=> generation.pause())
const playerMode = document.getElementById('playerMode').addEventListener('click', ()=> generation.playerMode())

console.log(generation)