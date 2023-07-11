function displayNewSegment() {
  const start = getLastElem(dynamicServersidePackets).startMS / SMALL_FACTOR
  const end = getLastElem(dynamicServersidePackets).endMS / SMALL_FACTOR
  const ratio = getLastElem(dynamicSettings).ratio1pxToMS
  const roundTripTimeMS = getLastElem(dynamicSettings).roundTripTimeMS / SMALL_FACTOR
  const seqNum = getLastElem(dynamicServersidePackets).seqNum
  const viewBoxHeight =
    document.querySelector('#mainSvg').viewBox.baseVal.height

  if (end > viewBoxHeight) {
    const mainSvg = document.querySelector('#mainSvg')
    mainSvg.style.height = viewBoxHeight + roundTripTimeMS + '%'
    mainSvg.viewBox.baseVal.height = viewBoxHeight + roundTripTimeMS
    document.querySelector('#lines').scrollTop =
      document.querySelector('#lines').scrollHeight
  }

  const newPacket = document.createElementNS(NAME_SPACE_URI, 'path')
  newPacket.setAttribute('stroke', 'black')
  newPacket.setAttribute('stroke-width', '0.1')
  newPacket.setAttribute('fill', 'none')
  newPacket.setAttribute(
    'd',
    'M10 ' +
      end * ratio +
      ' ' +
      'L90 ' +
      (end - roundTripTimeMS / 2) * ratio +
      'L90 ' +
      start * ratio +
      'L10 ' +
      (start + roundTripTimeMS / 2) * ratio +
      ' Z'
  )
  newPacket.setAttribute('id', seqNum)

  const newPacketTextPath = document.createElementNS(NAME_SPACE_URI, 'textPath')
  newPacketTextPath.setAttribute('href', '#' + seqNum)
  newPacketTextPath.setAttribute('startOffset', '21%')
  newPacketTextPath.innerHTML = 'Seq-Nr: ' + seqNum

  const newPacketText = document.createElementNS(NAME_SPACE_URI, 'text')
  newPacketText.append(newPacketTextPath)

  document.querySelector('#tcpSegments').append(newPacket)
  document.querySelector('#tcpSegments').append(newPacketText)
  return
}

function displayNewAck() {
  const newAck = dynamicPendingAcks.pop()
  const start = newAck.startMS / SMALL_FACTOR
  const end = newAck.endMS / SMALL_FACTOR
  const ratio = getLastElem(dynamicSettings).ratio1pxToMS
  const roundTripTimeMS = getLastElem(dynamicSettings).roundTripTimeMS / SMALL_FACTOR
  const newPacket = document.createElementNS(NAME_SPACE_URI, 'path')
  newPacket.setAttribute('stroke', 'black')
  newPacket.setAttribute('stroke-width', '0.05')
  newPacket.setAttribute('stroke-dasharray', '2 2')
  newPacket.setAttribute('d', 'M10 ' + start * ratio + 'L90 ' + end * ratio)
  document.querySelector('#tcpSegments').append(newPacket)
  return
}

function displayTimeoutBar() {
  
  const start = getLastElem(dynamicServerState).timestampFirstUnacked
  try {
    document.querySelector('#timeoutBar').remove()
  } catch (error) {}
  if(start == -1) return
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
