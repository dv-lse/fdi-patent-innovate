/* perpendicular distance (in radians) of point p from great circle defined by arc a */
/* see: http://www.movable-type.co.uk/scripts/latlong-vectors.html and
        http://mathforum.org/library/drmath/view/51785.html */

// cross-track distance:
//   (1) cross b & c vectors to get vector defining great circle
//   (2) measure angle between great circle and point of interest

function nvector(d) {
  const radians = Math.PI / 180
  let lambda = d[0] * radians
  let phi = d[1] * radians
  let v = { x : Math.cos(phi) * Math.cos(lambda),
            y : Math.cos(phi) * Math.sin(lambda),
            z : Math.sin(phi) }
  return v
}

function cross(a, b) {
  let v = { x : a.y*b.z - a.z*b.y,
        y : a.z*b.x - a.x*b.z,
        z : a.x*b.y - a.y*b.x }
  return v
}

function length(a) {
  return Math.sqrt(a.x*a.x + a.y*a.y + a.z*a.z)
}

function dot(a, b) {
  return a.x*b.x + a.y*b.y + a.z*b.z
}

function angle(a,b) {
  let sinTheta = length(cross(a,b))
  let cosTheta = dot(a,b)
  return Math.atan2(sinTheta, cosTheta)
}

function arc_distance(a, b, c) {
  let gc = cross(nvector(a), nvector(b))
  let alpha = angle(gc, nvector(c)) - Math.PI / 2

  return Math.abs(alpha)
}

export { arc_distance }
