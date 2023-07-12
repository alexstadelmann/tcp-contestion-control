function displayNewSegment() {
  const start = getLastElem(dynamicServerSegments).startMS / SMALL_FACTOR
  const end = getLastElem(dynamicServerSegments).endMS / SMALL_FACTOR
  const ratio = getLastElem(dynamicSettings).ratio1pxToMS
  const roundTripTimeMS = getLastElem(dynamicSettings).roundTripTimeMS / SMALL_FACTOR
  const seqNum = getLastElem(dynamicServerSegments).seqNum
  const isDelivered = getLastElem(dynamicServerSegments).isDelivered
  const viewBoxHeight =
    document.querySelector('#mainSvg').viewBox.baseVal.height
  const SCREEN_FACTOR = 0.9
  if (end > SCREEN_FACTOR*viewBoxHeight) {
    const mainSvg = document.querySelector('#mainSvg')
    mainSvg.style.height = viewBoxHeight + roundTripTimeMS + '%'
    mainSvg.viewBox.baseVal.height = viewBoxHeight + roundTripTimeMS
    document.querySelector('#lines').scrollTop =
      document.querySelector('#lines').scrollHeight
  }
  if (isDelivered) {
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
    
    newPacket.setAttribute('id', start + '!' + seqNum)
  
    const newPacketTextPath = document.createElementNS(NAME_SPACE_URI, 'textPath')
    newPacketTextPath.setAttribute('href', '#' + start + '!' + seqNum)
    newPacketTextPath.setAttribute('startOffset', '21%')
    newPacketTextPath.innerHTML = 'Seq-Nr: ' + seqNum
  
    const newPacketText = document.createElementNS(NAME_SPACE_URI, 'text')
    newPacketText.append(newPacketTextPath)
  
    document.querySelector('#tcpSegments').append(newPacket)
    document.querySelector('#tcpSegments').append(newPacketText)
    
  } else {
    const newPacket = document.createElementNS(NAME_SPACE_URI, 'path')
    newPacket.setAttribute('stroke', 'pink')
    newPacket.setAttribute('fill', 'pink')
    newPacket.setAttribute('stroke-width', '0.1')
    newPacket.setAttribute(
      'd',
      'M50 ' +
        (end  - roundTripTimeMS / 4)* ratio +
        ' ' +
        'L90 ' +
        (end - roundTripTimeMS / 2) * ratio  +
        'L90 ' +
        start * ratio +
        'L50 ' +
        (start + roundTripTimeMS / 4) * ratio +
        ' Z'
    )
    newPacket.setAttribute('id', start + '!' + seqNum)

    const newPacketTextPath = document.createElementNS(NAME_SPACE_URI, 'textPath')
    newPacketTextPath.setAttribute('href', '#' + start + '!' + seqNum)
    newPacketTextPath.setAttribute('startOffset', '21%')
    newPacketTextPath.innerHTML = 'Seq-Nr: ' + seqNum

    const newPacketText = document.createElementNS(NAME_SPACE_URI, 'text')
    newPacketText.append(newPacketTextPath)

  document.querySelector('#tcpSegments').append(newPacket)
  document.querySelector('#tcpSegments').append(newPacketText)
  
  }
  
}






