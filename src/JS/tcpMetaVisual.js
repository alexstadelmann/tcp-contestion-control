import { agents, metaPackets, getLastElem, getConfigState } from '@/JS/session'
import { adaptSvgSize } from './nextSegmentVisual'

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
  adaptSvgSize(end, getConfigState('roundTripTimeMS') / SMALL_FACTOR)
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
  newPacket.setAttribute('id', flag + start)

  const newPacketTextPath = document.createElementNS(NAME_SPACE_URI, 'textPath')
  newPacketTextPath.setAttribute('href', '#' + flag + start)
  newPacketTextPath.setAttribute('startOffset', '45%')
  newPacketTextPath.innerHTML = flag

  const newPacketText = document.createElementNS(NAME_SPACE_URI, 'text')
  newPacketText.append(newPacketTextPath)

  document.querySelector('#tcpMetaMessages').append(newPacket)
  document.querySelector('#tcpMetaMessages').append(newPacketText)
}

function tcpMetaSegmentServerToClient(start, end, flag) {
  const ratio = getConfigState('ratio1pxToMS')
  const newPacket = document.createElementNS(NAME_SPACE_URI, 'path')
  newPacket.setAttribute('d', 'M10 ' + end * ratio + 'L90 ' + start * ratio)
  newPacket.setAttribute('stroke', 'black')
  newPacket.setAttribute('stroke-width', '0.1')
  newPacket.setAttribute('id', flag + start)

  const newPacketTextPath = document.createElementNS(NAME_SPACE_URI, 'textPath')
  newPacketTextPath.setAttribute('href', '#' + flag + start)
  newPacketTextPath.setAttribute('startOffset', '45%')
  newPacketTextPath.innerHTML = flag

  const newPacketText = document.createElementNS(NAME_SPACE_URI, 'text')
  newPacketText.append(newPacketTextPath)

  document.querySelector('#tcpMetaMessages').append(newPacket)
  document.querySelector('#tcpMetaMessages').append(newPacketText)
}
