class Generation {
  constructor(ip5, popSize, boardDimension){
    this.popSize = popSize
    this.sketches = []
  }

  init(){
    for(let i = 0; i < this.popSize; i++){
      this.sketch[i] = createSketch()
    }
  }

  step(){
    this.games.forEach(game => {
      let status = game.step()
      if (status === -1) {
        console.log('LOST')
        sketch.noLoop()
        game.score = 1
      } else if (status === 1) {
        game.score += 1
      }
      drawBoxes(sketch, game)
    })
  }

  getDraw(){
    return function() {

    }
  }
}

function createSketch(){
  return new p5((sketch) => {
    let game

    sketch.setup = ()=> {
      sketch.createCanvas(canvasSize, canvasSize)
      let generation = new Generation(sketch, 12, boardDimension)
      game.addSnake(new Snake(sketch))
    }

    sketch.draw = () => {
      sketch.frameRate(fps)
      let status = game.step()

    }
  })
}