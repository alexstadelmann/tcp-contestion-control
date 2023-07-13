function displayNewAck() {
  const newAck = dynamicPendingAcks.pop()
  const start = newAck.startMS / SMALL_FACTOR
  const end = newAck.endMS / SMALL_FACTOR
  const BytesReceivedInOrder = newAck.ackNum
  const isDelivered = newAck.isDelivered
  

  const ratio = getLastElem(dynamicSettings).ratio1pxToMS
  const roundTripTimeMS = getLastElem(dynamicSettings).roundTripTimeMS /SMALL_FACTOR
  if (isDelivered) {
    
    const newPacket = document.createElementNS(NAME_SPACE_URI, 'path')
    newPacket.setAttribute('stroke', 'black')
    newPacket.setAttribute('stroke-width', '0.05')
    newPacket.setAttribute('stroke-dasharray', '2 2')
    newPacket.setAttribute('d', 'M10 ' + start * ratio + 'L90 ' + end * ratio)
    document.querySelector('#tcpSegments').append(newPacket)
    const newText = document.createElementNS(NAME_SPACE_URI, 'text') 
    newText.setAttribute('x', '3%')
    newText.setAttribute('y', start)
    newText.innerHTML = BytesReceivedInOrder
    document.querySelector('#tcpSegments').append(newText)
    
  } else {
    const newPacket = document.createElementNS(NAME_SPACE_URI, 'path')
    newPacket.setAttribute('stroke', 'pink')
    newPacket.setAttribute('stroke-width', '0.5')
    newPacket.setAttribute('stroke-dasharray', '2 2')
    
    newPacket.setAttribute('d', 'M10 ' + start * ratio + 'L50 ' + (end-roundTripTimeMS / 4) * ratio)
    document.querySelector('#tcpSegments').append(newPacket)
    const newText = document.createElementNS(NAME_SPACE_URI, 'text') 
    newText.setAttribute('x', '3%')
    newText.setAttribute('y', start)
    newText.innerHTML = BytesReceivedInOrder
    document.querySelector('#tcpSegments').append(newText)
  }
  
}