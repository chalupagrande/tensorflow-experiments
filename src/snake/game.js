class Game {
  constructor(sketch, boardWidth, boardHeight) {
    this.sketch = sketch
    this.opts = { boardWidth, boardHeight }
    this.board = []
    this.baitLocation = null

    // init board
    for (let row = 0; row < boardWidth; row++) {
      let col = [...Array(boardHeight)].map(() => 0)
      this.board.push(col)
    }

    this.snake = null
    this.newBait()
    this.score = 1
  }

  set(pos, val) {
    this.board[pos.x][pos.y] = val
  }

  get(pos) {
    return this.board[pos.x][pos.y]
  }

  addSnake(snake) {
    this.snake = snake
    this.snake.positions.forEach((pos) => this.set(pos, -1))
  }

  newBait() {
    let curVal = -1
    let pos
    while (curVal === -1 || curVal === 1) {
      let x = Math.floor(this.sketch.random(this.opts.boardWidth))
      let y = Math.floor(this.sketch.random(this.opts.boardHeight))
      pos = this.sketch.createVector(x, y)
      curVal = this.get(pos)
    }
    this.baitLocation = pos
    this.set(pos, 1)
  }

  step() {
    let { oldPositions, newPositions } = this.snake.move()

    let status = this.updateBoard(
      oldPositions,
      newPositions,
      this.baitLocation
    )
    if (status === 1) {
      this.snake.grow()
      this.newBait()
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
        curPiece.x >= this.opts.boardWidth ||
        curPiece.x < 0 ||
        curPiece.y >= this.opts.boardHeight ||
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
}