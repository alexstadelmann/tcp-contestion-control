

function displayNewSegment() {
  const start = dynamicServersidePackets.at(-1).startMS / SMALL_FACTOR
  const end= dynamicServersidePackets.at(-1).endMS / SMALL_FACTOR
  const ratio = dynamicSettings.at(-1).ratio1pxToMS
  const roundTripTimeMS = dynamicSettings.at(-1).roundTripTimeMS /SMALL_FACTOR
  const seqNum = dynamicServersidePackets.at(-1).seqNum
  const viewBoxHeight = document.getElementById('mainSvg').viewBox.baseVal.height
  console.log(viewBoxHeight)
  
  if(end > viewBoxHeight) {
    const mainSvg = document.getElementById('mainSvg')
    mainSvg.style.height = (viewBoxHeight + roundTripTimeMS) + '%'
    mainSvg.viewBox.baseVal.height = viewBoxHeight + roundTripTimeMS
    document.getElementById('lines').scrollTop = document.getElementById('lines').scrollHeight

  }

  const newPacket = document.createElementNS(NAME_SPACE_URI, 'path')
  newPacket.setAttribute('stroke', 'black')
  newPacket.setAttribute('stroke-width', '0.1')
  newPacket.setAttribute('fill', 'none')
  newPacket.setAttribute('d', 'M10 ' + end*ratio +' ' + 'L90 '+ ((end-roundTripTimeMS/2)*ratio) + 'L90 ' + start*ratio + 'L10 ' + ((start+roundTripTimeMS/2))*ratio + ' Z') 
  newPacket.setAttribute('id', seqNum)

  const newPacketTextPath = document.createElementNS(NAME_SPACE_URI, 'textPath')
  newPacketTextPath.setAttribute('href','#' + seqNum)
  newPacketTextPath.setAttribute('startOffset', '21%')
  newPacketTextPath.innerHTML = 'Seq-Nr: ' + seqNum

  const newPacketText = document.createElementNS(NAME_SPACE_URI, 'text')
  newPacketText.append(newPacketTextPath)

  document.querySelector('#tcpMetaMessages').append(newPacket)
  document.querySelector('#tcpMetaMessages').append(newPacketText)
  return
}

function displayNewAck() {
  const newAck = dynamicPendingAcks.pop()
  const start = newAck.startMS / SMALL_FACTOR
  const end = newAck.endMS / SMALL_FACTOR
  const ratio = dynamicSettings.at(-1).ratio1pxToMS
  const roundTripTimeMS = dynamicSettings.at(-1).roundTripTimeMS /SMALL_FACTOR
  const newPacket = document.createElementNS(NAME_SPACE_URI, 'path')
  newPacket.setAttribute('stroke', 'black')
  newPacket.setAttribute('stroke-width', '0.05')
  newPacket.setAttribute('stroke-dasharray', "2 2")
  newPacket.setAttribute('d', 'M10 ' + start*ratio + 'L90 ' + end*ratio)
  document.querySelector('#tcpMetaMessages').append(newPacket)
  return
}