

function displayNewSegment() {
  const start = dynamicServersidePackets.at(-1).start_ms / SMALL_FACTOR
  const end= dynamicServersidePackets.at(-1).end_ms / SMALL_FACTOR
  const ratio = dynamicSettings.at(-1).ratio1px_ms
  const rtt_ms = dynamicSettings.at(-1).rtt_ms /SMALL_FACTOR
  const sequence_number = dynamicServersidePackets.at(-1).sequence_number
  const viewBoxHeight = document.getElementById('main_svg').viewBox.baseVal.height
  console.log(viewBoxHeight)
  
  if(end > viewBoxHeight) {
    const main_svg = document.getElementById('main_svg')
    main_svg.style.height = (viewBoxHeight + rtt_ms) + '%'
    main_svg.viewBox.baseVal.height = viewBoxHeight + rtt_ms
    document.getElementById('lines').scrollTop = document.getElementById('lines').scrollHeight

  }

  const newPacket = document.createElementNS(NAME_SPACE_URI, 'path')
  newPacket.setAttribute('stroke', 'black')
  newPacket.setAttribute('stroke-width', '0.1')
  newPacket.setAttribute('fill', 'none')
  newPacket.setAttribute('d', 'M10 ' + end*ratio +' ' + 'L90 '+ ((end-rtt_ms/2)*ratio) + 'L90 ' + start*ratio + 'L10 ' + ((start+rtt_ms/2))*ratio + ' Z') 
  newPacket.setAttribute('id', sequence_number)

  const newPacketTextPath = document.createElementNS(NAME_SPACE_URI, 'textPath')
  newPacketTextPath.setAttribute('href','#' + sequence_number)
  newPacketTextPath.setAttribute('startOffset', '21%')
  newPacketTextPath.innerHTML = 'Seq-Nr: ' + sequence_number

  const newPacketText = document.createElementNS(NAME_SPACE_URI, 'text')
  newPacketText.append(newPacketTextPath)

  document.querySelector('#tcp_meta_messages').append(newPacket)
  document.querySelector('#tcp_meta_messages').append(newPacketText)
  return
}

function displayNewAck() {
  const newAck = dynamicPendingAcks.pop()
  const start = newAck.start_ms / SMALL_FACTOR
  const end = newAck.end_ms / SMALL_FACTOR
  const ratio = dynamicSettings.at(-1).ratio1px_ms
  const rtt_ms = dynamicSettings.at(-1).rtt_ms /SMALL_FACTOR
  const newPacket = document.createElementNS(NAME_SPACE_URI, 'path')
  newPacket.setAttribute('stroke', 'black')
  newPacket.setAttribute('stroke-width', '0.05')
  newPacket.setAttribute('stroke-dasharray', "2 2")
  newPacket.setAttribute('d', 'M10 ' + start*ratio + 'L90 ' + end*ratio)
  document.querySelector('#tcp_meta_messages').append(newPacket)
  return
}