function displayTimeoutBar() {
  
  const firstUnackedSegmentNum = getLastElem(dynamicServerState).firstUnackedSegmentNum
  console.log('firstUnackedSegmentNum', firstUnackedSegmentNum)
  const start = dynamicServerSegments[firstUnackedSegmentNum].sendingCompleteMS
  try {
    document.querySelector('#timeoutBar').remove()
  } catch (error) {}
  if(start == NONE) return
  const newTimeoutBar = document.createElementNS(NAME_SPACE_URI, 'line') 
  newTimeoutBar.setAttribute('stroke', 'orange')
  newTimeoutBar.setAttribute('stroke-width', '1')
  newTimeoutBar.setAttribute('x1', '91%')
  newTimeoutBar.setAttribute('y1', (start/SMALL_FACTOR).toString())
  newTimeoutBar.setAttribute('x2', '99%')
  newTimeoutBar.setAttribute('y2', (start/SMALL_FACTOR).toString())
  newTimeoutBar.setAttribute('id', 'timeoutBar')
  document.querySelector('#timeoutBarSvg').append(newTimeoutBar)


}