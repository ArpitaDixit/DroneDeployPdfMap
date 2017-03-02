// Arpita Dixit
// Using jsPDF
let _ddApi = null

/* Invoked from button click*/
function createPDF() {
  const document = new jsPDF()
  _tileUpd()
  document.save("Download.pdf")
}
/*GET Tile informtion*/
function _tileUpd() {
  new DroneDeploy({version: 1}).then(function(dronedeployApi) {
    _ddApi = dronedeployApi
    return dronedeployApi.Plans.getCurrentlyViewed()
  })
  .then(function(plan){
    return _fetchTileDataFromPlan(plan)
  })
  .then(_getTilesFromResponse)
  .then(_addImagetoPDF)
}
/*GET request for Tiles*/
function _fetchTileDataFromPlan(plan) {
  const layer = 'ortho'
  const zoom = 17
  return _ddApi.Tiles.get({
    planId: plan.id,
    layerName: layer,
    zoom: parseInt(zoom)
  })
}
/*return Tile image */
function _getTilesFromResponse(tileResponse) {
  return tileResponse.tiles
}
/*add converted image DataURL to doc*/
function _addImagetoPDF(linkURL) {
  for (let i = 0; i < linkURL.length; i++) {
    _getBase64Image(linkURL[i], function(dataURL) {
      doc.addImage(dataURL, 'PNG', 10, 50)
    })
  }
}
/*used FileReader for converting image URL to image Base64 DataURL */
function _convertFileToDataURL(url, callback) {
  const req = new XMLHttpRequest()
  req.cors = '*'
  req.onload = function() {
    const read = new FileReader()
    read.onloadend = function() {
      callback(read.result)
    }
    read.readAsDataURL(req.response)
  }
  req.open('GET', url)
  req.responseType = 'blob'
  req.send()
}
/*used HTML Canvas for converting image URL to image Base64 DataURL*/
function _getBase64Image(url, callback) {
  const image = new Image()
  image.crossOrigin = 'Anonymous'
  image.onload = function() {
    const canvas = document.createElement('CANVAS')
    const context = canvas.getContext('2d')
    let dataURL
    canvas.height = this.height
    canvas.width = this.width
    context.drawImage(this, 0, 0)
    dataURL = canvas.toDataURL('image/png')
    callback(dataURL)
    canvas = null
  }
  img.src = url
}