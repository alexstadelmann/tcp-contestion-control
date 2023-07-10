"use strict"

// SVG works better when the viebox has units from 0-100 than units from 0-1000.
// In the end one pixel should represent 1ms
const SMALL_FACTOR = 10
const NAME_SPACE_URI = "http://www.w3.org/2000/svg"

function updateSeqDiagramMeta() {
  if (dynamicMetaPackets.length == 0) return

  const sender = dynamicMetaPackets.at(-1).sender
  const start = dynamicMetaPackets.at(-1).startMS / SMALL_FACTOR
  const end= dynamicMetaPackets.at(-1).endMS / SMALL_FACTOR
  const flag = dynamicMetaPackets.at(-1).flag
  if (sender == "client") {
    tcpMetaSegmentClientToServer(start, end, flag)
  } else {
    tcpMetaSegmentServerToClient(start, end, flag)
  }
}

function tcpMetaSegmentClientToServer(start, end, flag) {
  if (dynamicMetaPackets.length == 0) {return}
  const ratio = dynamicSettings.at(-1).ratio1pxToMS
  
  const newPacket = document.createElementNS(NAME_SPACE_URI, 'path')
  newPacket.setAttribute('stroke', 'black')
  newPacket.setAttribute('stroke-width', '0.1')
  newPacket.setAttribute('d', 'M10 ' + start*ratio +' ' + 'L90 '+ end*ratio)
  newPacket.setAttribute('id', flag)

  const newPacketTextPath = document.createElementNS(NAME_SPACE_URI, 'textPath')
  newPacketTextPath.setAttribute('href','#' + flag)
  newPacketTextPath.setAttribute('startOffset', '45%')
  newPacketTextPath.innerHTML = flag

  const newPacketText = document.createElementNS(NAME_SPACE_URI, 'text')
  newPacketText.append(newPacketTextPath)

  document.querySelector('#tcpMetaMessages').append(newPacket)
  document.querySelector('#tcpMetaMessages').append(newPacketText)
} 

function tcpMetaSegmentServerToClient(start, end, flag) {
  const ratio = dynamicSettings.at(-1).ratio1pxToMS
  const newPacket = document.createElementNS(NAME_SPACE_URI, 'path')
  newPacket.setAttribute('d', 'M10 ' + end * ratio + 'L90 ' + start * ratio)
  newPacket.setAttribute('stroke', 'black')
  newPacket.setAttribute('stroke-width', '0.1')
  newPacket.setAttribute('id', flag)

  const newPacketTextPath = document.createElementNS(NAME_SPACE_URI, 'textPath')
  newPacketTextPath.setAttribute('href','#' + flag)
  newPacketTextPath.setAttribute('startOffset', '45%')
  newPacketTextPath.innerHTML = flag

  const newPacketText = document.createElementNS(NAME_SPACE_URI, 'text')
  newPacketText.append(newPacketTextPath)

  document.querySelector('#tcpMetaMessages').append(newPacket)
  document.querySelector('#tcpMetaMessages').append(newPacketText)
} 
