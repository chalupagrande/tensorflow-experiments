class Snake {
  constructor(ctx) {
    let {p, rows, cols} = ctx
    this.ctx = ctx
    let initialPos = p.createVector(Math.floor((cols-1)/2), Math.floor((rows-1)/2))
    this.headPos = initialPos
    this.positions = [initialPos]
    this.life = ctx.snakeLife

    this.brain = null
    this.heading = p.createVector(1,0)
    this.length = this.positions.length
    this.shouldGrow = false
    this.scan = {}
  }

  addBrain(b){
    this.brain = b
  }

  think(){
    let prediction = this.brain.predict(this.scan.scanValues)
    // figure out which index has the highest value
    let decision = prediction.reduce((a, v, i) => (
      v > a.val
      ? {val: v, i:i}
      : a, {val: -Infinity, i: 0})).i

    // assign that index a direction
    switch(decision) {
      // up
      case 0:
        this.setHeading(0,-1)
        break;
      // right
      case 1:
        this.setHeading(1,0)
        break;
      // down
      case 2:
        this.setHeading(0,1)
        break;
      // left
      case 3:
        this.setHeading(-1,0)
        break;
      default:
        this.setHeading(1,0)
        break;
    }
  }

  setHeading(x, y) {
    let {p} = this.ctx
    let newHeading = p.createVector(x, y)
    let combined = this.heading.add(newHeading)
    // cant go backwards
    if (combined.x === 0 && combined.y === 0) return
    this.heading = newHeading
    return this.heading
  }

  move() {
    let oldPositions = this.positions.map((p) => p.copy())
    let newPositions = []
    for (let i = 0; i < this.positions.length; i++) {
      let curPos = this.positions[i].copy()
      if (i === 0) {
        newPositions.push(curPos.add(this.heading))
        if (this.shouldGrow) {
          newPositions.push(...this.positions)
          break
        }
      } else {
        newPositions.push(this.positions[i - 1])
      }
    }
    this.shouldGrow = false
    this.headPos = newPositions[0]
    this.positions = newPositions
    this.life -= 1
    return {
      newPositions,
      oldPositions,
    }
  }

  grow() {
    this.shouldGrow = true
    this.life += 100
  }

  look(board){
    let {sightSize, p} = this.ctx
    let scanObj = {}
    let scanValues = []
    let start = Math.floor(sightSize/2) * -1
    let end = Math.floor(sightSize/2)
    for(let x = start; x <= end; x++) {
      let curCol = []
      for(let y = start; y <= end; y++) {
        let scanVector = p.createVector(x, y)
        let cur = p5.Vector.add(scanVector, this.headPos)
        let val
        try {
          val = board[cur.x][cur.y]
        } catch {
          val = -1
        }
        if(val === undefined) val = -1
        scanObj[`${x},${y} -- ${cur.x},${cur.y}`] = val
        scanObj._headPos = this.headPos
        curCol.push(val)
      }
      scanValues.push(curCol)
    }
    this.scan = {scanValues, scanObj}
    return this.scan
  }
}
