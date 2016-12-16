//
// Unfortunately, topojson simplify occasionally inverts winding order for polygons.
//   This code can postprocess extracted GeoJSON to detect problems and enforce the
//   right hand rule.
//

// see http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order

function clockwise(coords) {
  let xs = coords.map( (d) => d[0] )
  let ys = coords.map( (d) => d[1] )
  let edges = []
  let sum = 0
  for(let i=0; i<coords.length-1; i++) {
    edges[i] = (xs[i+1] - xs[i]) * (ys[i+1] + ys[i])
    sum += edges[i]
  }

  // NB zero sum results exist:  these rings have ambiguous winding
  return sum > 0
}

function ring_enforce_rhr(linear_ring) {
  let fixed = false
  linear_ring.forEach( (coords, i) => {
    let cw = clockwise(coords)
    // first ring should be clockwise; all others counter-clockwise
    if(i === 0 ? !cw : cw) {
      coords.reverse()
      fixed = true
    }
  })
  return fixed
}

function enforce_rhr(feature) {
  let fixed = false
  switch(feature.geometry.type) {
    case 'Polygon': fixed = ring_enforce_rhr(feature.geometry.coordinates); break;
    case 'MultiPolygon': fixed = feature.geometry.coordinates.some(ring_enforce_rhr); break;
  }
  if(fixed)
    console.log('Fixed winding order inversion for ' + JSON.stringify([ feature.id, feature.properties ]))
  return feature
}

export { enforce_rhr, clockwise }
