// tensors to set and use in training and predicting
let model
let inputs
let inputsArrayRaw = []
let trainingInputs = tf.tensor([[1,0], [0,1], [0,0], [1,1]])
let answers = tf.tensor([[1], [1], [0], [0]])

// p5 stuff
let size = 400 // canvas size in pixels
let resolution = 8 // number of boxes going on x and y
let scl = size / resolution

// variables
let doneTraining = true // toggles on and off to signal that the training has finished and can rerender
let settings = {} // options set by switches
let lossEl = null
let cyclesEl = null


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

function setup() {
  addSettingInputs()
  createElement('h1', 'Grid Visualization')
  createCanvas(size, size);
  initialDraw()
  setupModel()
}


function draw() {
  frameRate(8)

  // noLoop()
  if(doneTraining) {
    doneTraining = false
    model.fit(trainingInputs, answers, {
      shuffle: true
    })
    .then(({history}) => {
      let loss = history.loss[0]
      updateStats(loss)
      if(loss.toFixed(2)*1 === 0) {
        console.log('DONE')
        return // dont reset done training
      }
      doneTraining = true

      let prediction = model.predict(inputs).dataSync()

      let i = 0
      for(let x = 0; x < resolution; x++) {
        for(let y = 0; y < resolution; y++) {
          // push()
          // translate(x * scl, y * scl)
          // fill(map(prediction[i], 0, 1, 0, 255))
          // stroke(255)
          // rect(0, 0, scl, scl)
          // pop()
          drawBoxes(x,y, map(prediction[i], 0, 1, 0, 255))
          i++
        }
      }
    })
  }
}

function updateStats(loss){
  lossEl.html(`Loss: ${loss}`)
  cyclesEl.html(`Cycles: ${frameCount}`)
}

// creates a model and populates the tensors
function setupModel(){
  doneTraining = true
  if(model) model.dispose()
  model = tf.tidy(()=> getModel())
  inputs = tf.tensor(inputsArrayRaw)
  inputs.print()
}

function initialDraw(){
  for(let x = 0; x < resolution; x++) {
    for(let y = 0; y < resolution; y++) {
      let {xVal, yVal} = drawBoxes(x,y,100)
      inputsArrayRaw.push([xVal, yVal])
    }
  }
}

function drawBoxes(x,y, val){
  let xVal = map(x, 0, resolution - 1, 0, 1)
  let yVal = map(y, 0, resolution - 1, 0, 1)
  push()
  translate(x * scl, y * scl)
  fill(val)
  stroke(255)
  rect(0, 0, scl, scl)
  fill(val > 255/2 ? 0 : 255)
  strokeWeight(0)
  textAlign(CENTER)
  textSize(8)
  text(`[${xVal.toFixed(1) * 10}, ${yVal.toFixed(1) * 10}]`, scl/2, scl/2)
  pop()
  return {xVal, yVal}
}


function addSettingInputs(){
  let div = createDiv(`<h1>Settings</h1>`)
  div.id = 'settings'


  let reset = createButton('reset')
  reset.mousePressed(setupModel)
  div.child(reset)
  div.child(createElement('br'))

  settings.activation = 'relu'
  let actFuncEl = createSelect()
  actFuncEl.option('relu');
  actFuncEl.option('sigmoid');
  actFuncEl.option('tanh');
  actFuncEl.option('linear');
  actFuncEl.option('swish');
  actFuncEl.option('selu');
  actFuncEl.changed((val)=> {
    settings.activation = val.target.value
  })
  div.child(createElement('label', 'Activation Function'))
  div.child(actFuncEl)
  div.child(createElement('br'))

  settings.optimizer = 'sgd'
  let optimizerEl = createSelect()
  optimizerEl.option('sgd');
  optimizerEl.option('momentum');
  optimizerEl.option('adagrad');
  optimizerEl.option('adadelta');
  optimizerEl.option('adam');
  optimizerEl.option('adamax');
  optimizerEl.option('rmsprop');
  optimizerEl.changed((val)=> {
    settings.optimizer = val.target.value
  })
  div.child(createElement('label', 'Optimizer Function'))
  div.child(optimizerEl)
  div.child(createElement('br'))

  settings.loss = 'meanSquaredError'
  let lossFuncEl = createSelect()
  lossFuncEl.option('absoluteDifference');
  lossFuncEl.option('computeWeightedLoss');
  lossFuncEl.option('cosineDistance');
  lossFuncEl.option('hingeLoss');
  lossFuncEl.option('huberLoss');
  lossFuncEl.option('logLoss');
  lossFuncEl.option('meanSquaredError');
  lossFuncEl.option('sigmoidCrossEntropy');
  lossFuncEl.option('softmaxCrossEntropy');
  lossFuncEl.changed((val)=> {
    settings.loss = val.target.value
  })
  div.child(createElement('label', 'Loss Function'))
  div.child(lossFuncEl)
  div.child(createElement('br'))


  settings.learningRate = 0.2
  let learningRateEl = createSpan(settings.learningRate)
  let rateSlider = createSlider(0, 1, 0.2, 0.1)
  rateSlider.changed((val)=> {
    settings.learningRate = val.target.value
    learningRateEl.html(val.target.value)
  })
  div.child(createElement('label', 'Learning Rate'))
  div.child(rateSlider)
  div.child(learningRateEl)
  div.child(createElement('br'))

  lossEl = createP(`Loss: 1000`)
  div.child(lossEl)
  cyclesEl = createP(`Cycles: 0`)
  div.child(cyclesEl)
}