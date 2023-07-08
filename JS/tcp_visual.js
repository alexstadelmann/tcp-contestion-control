'use strict'

// SVG works better when the viebox has units from 0-100 than units from 0-1000.
// In the end one pixel should represent 1ms
const SMALL_FACTOR = 10
const NAME_SPACE_URI = 'http://www.w3.org/2000/svg'

function update_seq_diagram_meta() {
  if (dynamic_meta_packets.length == 0) {return}

  const sender = dynamic_meta_packets.at(-1).sender
  const start = dynamic_meta_packets.at(-1).start_ms / SMALL_FACTOR
  const end= dynamic_meta_packets.at(-1).end_ms / SMALL_FACTOR
  const flag = dynamic_meta_packets.at(-1).flag
  if (sender == 'client') {
    TCPMetaSegmentClientToServer(start, end, flag)
  } else {
    TCPMetaSegmentServerToClient(start, end, flag)
  }
 
}

// const newPacket = document.createElementNS('http://www.w3.org/2000/svg', 'path');
// newPacket.classList.add('segment');
// newPacket.setAttribute('d',
//     'M' + xStart + ' ' + yFirstByteStart + 
//     'L' + xEnd + ' ' + yFirstByteEnd +
//     'L' + xEnd + ' ' + yLastByteEnd +
//     'L' + xStart + ' ' + yLastByteStart + 
//     'Z' 
// );

function TCPMetaSegmentClientToServer(start, end, flag) {
  if (dynamic_meta_packets.length == 0) {return}
  const ratio = dynamic_settings.at(-1).ratio1px_ms
  
  const newPacket = document.createElementNS(NAME_SPACE_URI, 'path')
  // newPacket.setAttribute('x1', '10%')
  // newPacket.setAttribute('y1', start*ratio)
  // newPacket.setAttribute('x2', '90%')
  // newPacket.setAttribute('y2', end*ratio)
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

  document.querySelector('#tcp_meta_messages').append(newPacket)
  document.querySelector('#tcp_meta_messages').append(newPacketText)
} 

function TCPMetaSegmentServerToClient(start, end, flag) {
  const ratio = dynamic_settings.at(-1).ratio1px_ms
  const newPacket = document.createElementNS(NAME_SPACE_URI, 'line')
  newPacket.setAttribute('x1', '90%')
  newPacket.setAttribute('y1', start*ratio)
  newPacket.setAttribute('x2', '10%')
  newPacket.setAttribute('y2', end*ratio)
  newPacket.setAttribute('stroke', 'black')
  newPacket.setAttribute('stroke-width', '0.1')

  document.querySelector('#tcp_meta_messages').append(newPacket)
} 