import { agents, metaPackets, getLastElem, getConfigState } from '@/JS/session'

// SVG works better when the viebox has units from 0-100 than units from 0-1000.
export const SMALL_FACTOR = 10
export const NAME_SPACE_URI = 'http://www.w3.org/2000/svg'

export function updateSeqDiagramMeta() {
  if (metaPackets.length == 0) return

  const sender = getLastElem(metaPackets).sender
  const start = getLastElem(metaPackets).startMS / SMALL_FACTOR
  const end = getLastElem(metaPackets).endMS / SMALL_FACTOR
  const flag = getLastElem(metaPackets).flag
  if (sender == agents.CLIENT) {
    tcpMetaSegmentClientToServer(start, end, flag)
  } else {
    tcpMetaSegmentServerToClient(start, end, flag)
  }
}

function tcpMetaSegmentClientToServer(start, end, flag) {
  if (metaPackets.length == 0) {
    return
  }
  const ratio = getConfigState('ratio1pxToMS')

  const newPacket = document.createElementNS(NAME_SPACE_URI, 'path')
  newPacket.setAttribute('stroke', 'black')
  newPacket.setAttribute('stroke-width', '0.1')
  newPacket.setAttribute(
    'd',
    'M10 ' + start * ratio + ' ' + 'L90 ' + end * ratio,
  )
  newPacket.setAttribute('id', flag)

  const newPacketTextPath = document.createElementNS(NAME_SPACE_URI, 'textPath')
  newPacketTextPath.setAttribute('href', '#' + flag)
  newPacketTextPath.setAttribute('startOffset', '45%')
  newPacketTextPath.innerHTML = flag

  const newPacketText = document.createElementNS(NAME_SPACE_URI, 'text')
  newPacketText.append(newPacketTextPath)

  document.querySelector('#tcpMetaMessages').append(newPacket)
  document.querySelector('#tcpMetaMessages').append(newPacketText)
  renderTimeRectangle(start, end, ratio,'1s', '#tcpMetaMessages')
}
export function renderTimeRectangle(start, end,ratio, time,  elementId) {
  try {
    document.querySelector('#timeRect').remove()
  } catch (error) {}
  

  const timeRectangle = document.createElementNS(NAME_SPACE_URI, 'rect')
  timeRectangle.setAttribute('x', 10)
  timeRectangle.setAttribute('y', start)
  timeRectangle.setAttribute('width', '80%')
  timeRectangle.setAttribute('height', '100')
  timeRectangle.setAttribute('fill-opacity', 1)
  timeRectangle.setAttribute('id', 'timeRect')
  timeRectangle.setAttribute('fill', 'white')
  timeRectangle.setAttribute('stroke-width', '0.1')
  timeRectangle.setAttribute('stroke', 'black')

  const animate = document.createElementNS(NAME_SPACE_URI, 'animate')
  animate.setAttribute('attributeType', 'XML')
  animate.setAttribute('attributeName', 'y' )
  animate.setAttribute('from', start*ratio)
  animate.setAttribute('to', end*ratio)
  animate.setAttribute('fill', 'freeze')
  animate.setAttribute('begin','indefinite')
  // animate.setAttribute('values', start*ratio + ';' + end*ratio)
  animate.setAttribute('dur', time)
  timeRectangle.append(animate)
  document.querySelector(elementId).append(timeRectangle)
  animate.beginElement()
}


function tcpMetaSegmentServerToClient(start, end, flag) {
  const ratio = getConfigState('ratio1pxToMS')
  const newPacket = document.createElementNS(NAME_SPACE_URI, 'path')
  newPacket.setAttribute('d', 'M10 ' + end * ratio + 'L90 ' + start * ratio)
  newPacket.setAttribute('stroke', 'black')
  newPacket.setAttribute('stroke-width', '0.1')
  newPacket.setAttribute('id', flag)

  const newPacketTextPath = document.createElementNS(NAME_SPACE_URI, 'textPath')
  newPacketTextPath.setAttribute('href', '#' + flag)
  newPacketTextPath.setAttribute('startOffset', '45%')
  newPacketTextPath.innerHTML = flag

  const newPacketText = document.createElementNS(NAME_SPACE_URI, 'text')
  newPacketText.append(newPacketTextPath)

  document.querySelector('#tcpMetaMessages').append(newPacket)
  document.querySelector('#tcpMetaMessages').append(newPacketText)
  renderTimeRectangle(start, end, ratio,'1s', '#tcpMetaMessages')
}
