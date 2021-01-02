class Brain {
  constructor(ctx){
    this.ctx = ctx
    this.model = this.createModel()
  }

  createModel() {
    let {
      sightSize,
      nnHiddenLayers,
      nnHiddenNodes,
      nnActivationFunc,
      nnLearningRate,
      nnOptimizer,
      nnLoss
    } = this.ctx

    tf.setBackend('cpu')

    let layers = []
    // create hidden layers
    for(let i = 0; i < nnHiddenLayers; i++) {
      // if it is the first layer, define input shape
      let l = i === 0
        ? tf.layers.dense({inputShape: [sightSize * sightSize], units: nnHiddenNodes, activation: nnActivationFunc})
        : tf.layers.dense({units: nnHiddenNodes, activation: 'softmax'})
      layers.push(l)
    }
    // create output layer
    // units = 4 because left, down, up, right
    layers.push(tf.layers.dense({units: 4}))
    const optimizer = tf.train[nnOptimizer](nnLearningRate);

    const model = tf.sequential({layers})

    model.compile({
      optimizer: optimizer,
      loss: tf.losses[nnLoss],
      metrics: ['accuracy']
    })
    return model
  }

  predict(input){
    let output = this.model.predict(tf.tensor([input.flat()]))
    return output.dataSync()
  }
}