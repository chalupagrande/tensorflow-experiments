
class GameInstance {
  /**
   * @param {object} ctx - {
   *                          p5: p5 instance
   *                          w: width in pixels of canvas
   *                          h: height in pixels of canvas
   *                          rows: height in tiles for the gameboard
   *                          cols: width in tiles for the gameboard
   *                          fps: frames per sec of game
   *                         }
   */
  constructor(ctx) {
    this.elements = {}
    this.ctx = ctx
    this.playState = 'play'
    this.sketch = new p5((p) => {
      p.setup = this.setup.bind(this, p)
      p.draw = this.draw.bind(this, p)
    })
    this.snake = new Snake({p: this.sketch, ...ctx, elements: this.elements})
    this.snake.addBrain(new Brain(this.ctx))
    this.game = new Game({p: this.sketch, ...ctx, elements: this.elements})
    this.game.addSnake(this.snake)
    this.game.newBait()
    this.snake.look()
  }

  setPlayState(s){
    this.playState = s
    switch(this.playState) {
      case 'play':
        this.sketch.loop()
        break;
      case 'pause':
        this.sketch.noLoop()
        break;
      default:
        this.sketch.loop()
    }
  }

  setPlayerMode(){
    this.sketch.keyPressed = ()=>{
      if (this.sketch.keyCode === this.sketch.LEFT_ARROW) {
        this.snake.setHeading(-1,0)
      } else if (this.sketch.keyCode === this.sketch.RIGHT_ARROW) {
        this.snake.setHeading(1,0)
      } else if (this.sketch.keyCode === this.sketch.UP_ARROW) {
        this.snake.setHeading(0,-1)
      } else if (this.sketch.keyCode === this.sketch.DOWN_ARROW) {
        this.snake.setHeading(0,1)
      }
    }
  }

  setup(p){
    let globalParentDiv = p.select('#globalParentDiv')
    let container = p.createDiv()
    container.class('game')
    globalParentDiv.child(container)
    let score = p.createSpan(`Score: ${this.game.score || 'NA'}`)
    let life = p.createSpan(`Life: ${this.snake.life || 'NA'}`)
    this.elements.score = score
    this.elements.life = life
    container.child(score)
    container.child(life)
    this.elements.canvas = p.createCanvas(this.ctx.w, this.ctx.h)
    container.child(this.elements.canvas)
    this.elements.container = container
  }

  draw(p){
    p.frameRate(this.ctx.fps)
    this.game.render()
    this.game.step()
  }
}