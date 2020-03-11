
const mvc = window.mvc || {
  run: () => {},
  loop: () => {}
};

const math = window.math

const start = (
  canvas,
  fInput,
  xMinInput,
  xMaxInput,
  yMinInput,
  yMaxInput,
) => {
  const {
    offsetWidth: pw,
    offsetHeight: ph
  } = document.querySelector('body')

  // setting up the canvas
  const ctx = canvas.getContext("2d");
  ctx.canvas.height = ph;
  ctx.canvas.width = pw;

  // use the framework to setup the state pipeline
  const triggers = mvc.run(
    state,
    actions,
    render(ctx, pw, ph),
    true // run the render initially
  )

  // get the function that will change a key of state
  const stateChanger = changer(triggers.changeState)

  // setup the elements to be looped over
  const elements = {
    f: fInput,
    xMin: xMinInput,
    xMax: xMaxInput,
    yMin: yMinInput,
    yMax: yMaxInput,
  }

  // assign the event listeners
  Object.entries(elements).map(
    ([ key, element ]) =>
      addEventListener(element, 'change', stateChanger(key))
  )
}

const addEventListener = (element, type, func) => {
  element.addEventListener(type, func)
  return () => element.removeEventListener('type', func)
}

const changer = changeState => key => ({ target: { value } }) => changeState(key, value)

const state = {
  f: 'x',
  xMin: -10,
  xMax: 10,
  yMin: -10,
  yMax: 10
}

const actions = {
  changeState: (key, data) => s => ({
    ...s,
    [key]: data,
  }),
}

const pointToCanvas = (pw, ph, xMin, xMax, yMin, yMax) => (x, y) => [ (x - xMin) / (xMax - xMin) * pw, ph - (y - yMin) / (yMax - yMin) * ph ]

const render = (ctx, pw, ph) => ({ f, xMin, xMax, yMin, yMax }, a) => {

  const plotPoint = pointToCanvas(pw, ph, xMin, xMax, yMin, yMax)

  // *** clear the canvas
  ctx.clearRect(0, 0, pw, ph)

  // *** draw the axes
  const [ originX, originY ] = plotPoint(0, 0)
  ctx.lineWidth = 2;
  ctx.beginPath()
  ctx.moveTo(originX, 0)
  ctx.lineTo(originX, ph)
  ctx.moveTo(0, originY)
  ctx.lineTo(pw, originY)
  ctx.stroke()

  // *** TODO: draw the labels


  // *** draw the points
  const numberOfPoints = 1000;
  const evalF = x => math.evaluate(f, { x })
  const delta = (xMax - xMin) / numberOfPoints
  Array(numberOfPoints).fill().map((_, i) => {
    const x = xMin + i * delta
    const y = evalF(x)
    const [cx, cy] = plotPoint(x, y)
    ctx.fillRect(cx - 2, cy - 2, 4, 4)
  })
}


/**
 * RUN THE THING
 */
((...args)=>{
  start(...args)
})(
  document.getElementById('canvas'),
  document.getElementById('f-input'),
  document.getElementById('x-min-input'),
  document.getElementById('x-max-input'),
  document.getElementById('y-min-input'),
  document.getElementById('y-max-input'),
)
