class Generation {
  /**
   * @param {p5 instance} p - Instance of p5.js
   * @param {int} popSize - number of individual snakes in the population
   * @param {object} ctx - {
   *                          name: name of game instance
   *                          w: width in pixels of canvas
   *                          h: height in pixels of canvas
   *                          rows: height in tiles for the gameboard
   *                          cols: width in tiles for the gameboard
   *                          fps: frames per sec of game
   *                         }
   */
  constructor(ctx){
    this.population = this.createPopulation()
    this.playState = 'play'
  }

  createPopulation(){
    return [...Array(populationSize)].map(e => (
      new GameInstance(ctx)
    ))
  }

  play(){
    this.playState = 'play'
    this.population.forEach(e => e.setPlayState(this.playState))
  }

  pause(){
    this.playState = 'pause'
    this.population.forEach(e => e.setPlayState(this.playState))
  }

  playerMode(){
    this.population.forEach(e => e.setPlayerMode())
  }
}