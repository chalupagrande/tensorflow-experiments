let settings = {
  activation: 'relu',
  learningRate: 0.2,
  optimizer: 'sgd',
  loss: 'meanSquaredError'
}

function getModel(){
  const model = tf.sequential({
    layers: [
      tf.layers.dense({inputShape: [2], units: 4, activation: settings.activation}),
      tf.layers.dense({units: 1}),
    ]
   });

  const learningRate = settings.learningRate
  const optimizer = tf.train[settings.optimizer](learningRate);

  model.compile({
    optimizer: optimizer,
    loss: tf.losses[settings.loss],
    metrics: ['accuracy']
  })

  return model
}

tf.tidy(()=> {
  let model = getModel()
  let prediction = model.predict(tf.tensor([[0,1]]))
  console.log(`prediction 1: ${prediction.dataSync()}`)

  prediction = model.predict(tf.tensor([[0,1]]))
  console.log(`prediction 2: ${prediction.dataSync()}`)

  randomizeWeights(model)

  prediction = model.predict(tf.tensor([[0,1]]))
  console.log(`prediction 3: ${prediction.dataSync()}`)


  randomizeWeights(model)

  prediction = model.predict(tf.tensor([[0,1]]))
  console.log(`prediction 4: ${prediction.dataSync()}`)

  randomizeWeights(model)

  prediction = model.predict(tf.tensor([[0,1]]))
  console.log(`prediction 5: ${prediction.dataSync()}`)



})

function randomizeWeights(model){
  let layersLength = model.layers.length
  // iterate over layers
  for (let i = 0; i < layersLength; i++) {
    let newWeightArray = []
    for (let j = 0; j < 2; j++) {
      let weights = model.layers[i].getWeights()[j]
      let shape = weights.shape
      let weightData = weights.dataSync().slice()

      let newWeights = [...Array(weightData.length)].map(() => Math.random() * 2 - 1)
      newWeightArray.push(tf.tensor(newWeights, shape))
    }
    model.layers[i].setWeights(newWeightArray)
  }
}

console.log(tf.memory())
