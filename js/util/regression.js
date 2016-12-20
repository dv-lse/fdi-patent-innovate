import * as d3 from 'd3'

function least_squares() {
  let x_fn = (d) => d[0]
  let y_fn = (d) => d[1]

  function result(data) {
    let n = data.length
    let sum_x = d3.sum(data, x_fn)
    let sum_y = d3.sum(data, y_fn)
    let sum_xx = d3.sum(data, (d) => Math.pow(x_fn(d), 2))
    let sum_yy = d3.sum(data, (d) => Math.pow(y_fn(d), 2))
    let sum_xy = d3.sum(data, (d) => x_fn(d) * y_fn(d))

    let slope = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x)
    let intercept = (sum_y - slope * sum_x) / n

    return (x) => slope * x + intercept
  }

  result.x = function(fn) {
    if(!arguments) return x_fn
    x_fn = fn
    return result
  }

  result.y = function(fn) {
    if(!arguments) return y_fn
    y_fn = fn
    return result
  }

  return result
}

export { least_squares }
