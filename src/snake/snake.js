class Snake {
  constructor(ip5) {
    this.ip5 = ip5
    let initialPos = ip5.createVector(0, 0)
    this.headPos = initialPos
    this.positions = [initialPos]

    this.heading = ip5.createVector(1, 0)
    this.length = this.positions.length
    this.shouldGrow = false
  }

  setHeading(x, y) {
    let newHeading = this.ip5.createVector(x, y)
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
    return {
      newPositions,
      oldPositions,
    }
  }

  grow() {
    this.shouldGrow = true
  }
}
