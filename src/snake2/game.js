class Game {
  constructor(ctx){
    this.ctx = ctx
    this.board = []
    this.baitLocation = null

    let {rows, cols} = this.ctx
    // init board
    for (let row = 0; row < rows; row++) {
      let col = [...Array(cols)].map(() => 0)
      this.board.push(col)
    }
    this.snake = null
    this.score = 1
    this.gameOver = false
  }

  set(pos, val) {
    this.board[pos.x][pos.y] = val
  }

  get(pos) {
    return this.board[pos.x][pos.y]
  }

  // adds a snake to the game
  addSnake(snake) {
    this.snake = snake
    this.snake.positions.forEach((pos) => this.set(pos, -1))
  }

  // looks for a new random place to put the bait
  newBait() {
    let {p, rows, cols} = this.ctx
    let curVal = -1
    let pos
    while (curVal === -1 || curVal === 1) {
      let x = Math.floor(p.random(cols))
      let y = Math.floor(p.random(rows))
      pos = p.createVector(x, y)
      curVal = this.get(pos)
    }
    this.baitLocation = pos
    this.set(pos, 1)
  }

  step() {
    this.snake.look(this.board)
    this.snake.think()
    let { oldPositions, newPositions } = this.snake.move()

    let status = this.updateBoard(
      oldPositions,
      newPositions,
      this.baitLocation
    )
    if (status === 1) {
      this.snake.grow()
      this.newBait()
      this.score += 1
    } else if(status === -1){
      this.gameOver = true
    }
    return status
  }

  updateBoard(prevPos, curPos, bait) {
    try {
      prevPos.forEach((pre) => this.set(pre, 0))
      curPos.forEach((cur) => this.set(cur, -1))
    } catch {
      return -1
    }
    let positionsCopy = [...curPos]
    for (let i = 0; i < positionsCopy.length; i++) {
      let curPiece = positionsCopy[i]
      positionsCopy.splice(i, 1)
      let rest = positionsCopy
      // runs into itself

      for (let o = 0; o < rest.length; o++) {
        let other = rest[o]

        if (curPiece.equals(other)) {
          return -1
        }
      }
      // out of bounds
      if (
        curPiece.x >= this.ctx.cols ||
        curPiece.x < 0 ||
        curPiece.y >= this.ctx.rows ||
        curPiece.y < 0
      )
        return -1
      // finds bait
      if (curPiece.equals(bait)) {
        return 1
      }
      return 0
    }
  }

  render(){
    let {scl, p, elements, sightSize} = this.ctx
    // update game score and life information
    elements.score.html(`Score: ${this.score}`)
    elements.life.html(`Life: ${this.snake.life}`)
    if(this.gameOver) {
      p.noLoop()
      return
    }
    p.background(100)
    let snakePos = this.snake.positions
    let applePos = this.baitLocation

    // draw what the snake is looking at
    p.push()
    let start = Math.floor(sightSize/2) * -1
    let end = Math.floor(sightSize/2)
    p.noStroke()
    p.fill(120)
    for(let x = start; x <= end; x++) {
      for(let y = start; y <= end; y++) {
        let v = p.createVector(x,y)
        let pos = p5.Vector.add(v, this.snake.headPos)
        p.rect(pos.x * scl, pos.y * scl, scl, scl)
      }
    }
    p.pop()

    // draw where the snake is
    p.push()
    p.noStroke()
    snakePos.forEach((pos, i) => {
      i === 0 ? p.fill(0) : p.fill(40)
      p.rect(pos.x * scl, pos.y * scl, scl, scl)

    })
    p.pop()

    // draw the apple
    p.push()
    p.noStroke()
    p.fill(255, 0, 0)
    p.rect(applePos.x * scl, applePos.y * scl, scl, scl)
    p.pop()
  }
}