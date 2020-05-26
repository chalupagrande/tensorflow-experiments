class Sketch {
  constructor(ip5, opts){
    this.opts = opts
    this.ip5 = ip5
    this.game = new Game()
  }

  static setup(p){
    p.createCanvas(gameBoardSize, gameBoardSize)
  }

  static draw(p){
    p.frameRate(fps)
    p.background(p.random(255))
  }
}