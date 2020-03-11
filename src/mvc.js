/** three pieces
- state
  - one of these
- state change triggers
  - many of these
- actions
  - functions with passed in state that change the data and return state again
  - purely functional system of functions
- render
  - one function that renders the whole thing out based on one set of state

state -> model
view -> render
actions -> control

render could be on a loop or called after state updates

*/


/**
 * State closure and state mutation function
 * @param {any} state Initial State
 * @param {object: { [key]: ([data]) => (state) => newState }} actions Object holding functions that return functions that mutate state based on new data and current state
 * @param {function} render Function that takes state and does something based on state. Will be called after every state mutation
 * Returns
 *  object holding state mutation functions
*/
function run(state, actions, render, init = false) {
  let s = state
  const a = Object.entries(actions).reduce((ac, [name, action]) => ({
    ...ac,
    [name]: (...d) => {
      s = action(...d)(s)
      render(s, a)
    }
  }), {})
  init && render(state, actions)
  return a
}

/**
 * State closure with mutations on a loop
 * @param {any} state Initial State
 * @param {object: { [key]: ([data]) => (state) => newState }} actions Object holding functions that return functions that mutate state based on new data and current state
 * @param {function} render Function that takes state and does something based on state. Will be called after every {time} milliseconds
 * @param {number} time How many milliseconds between calls
 * @param {string} every Key of action function that will be called before every render
 *
 * Returns
 * [
 *  object holding state mutation functions,
 *  start function,
 *  stop function
 * ]
 */
function loop(state, actions, render, time, every) {
  let s = state
  const a = Object.entries(actions).reduce((ac, [name, action]) => ({
    ...ac,
    [name]: (...d) => {
      s = action(...d)(s)
    }
  }), {})

  every = (every && a[every]) || (() => 0)
  let fun
  const repeat = () => {
    every(s)
    render(s)
    setTimeout(fun, time)
  }

  return [
    a,
    () => {
      fun = repeat
      setTimeout(fun, time)
    },
    () => {
      fun = () => {}
    }
  ]
}

// export the good stuff
window.mvc = window.mvc || {
  run,
  loop
}
