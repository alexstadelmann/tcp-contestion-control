import { SMALL_FACTOR, NAME_SPACE_URI } from '@/JS/tcpMetaVisual'
import { getConfigState, getSegmentAttribute } from '@/JS/session'

export function adaptSvgSize(end, roundTripTimeMS ) {
  const ratio = getConfigState('ratio1pxToMS')

  
  const viewBoxHeight =
    document.querySelector('#mainSvg').viewBox.baseVal.height
    console.log('viewBoxHeight before', viewBoxHeight)
    if (end*ratio > viewBoxHeight - 20) {
      const mainSvg = document.querySelector('#mainSvg')
      mainSvg.style.height = viewBoxHeight + roundTripTimeMS*ratio + '%'
      mainSvg.viewBox.baseVal.height = viewBoxHeight + roundTripTimeMS/2*ratio
      document.querySelector('#lines').scrollTop = document.querySelector('#lines').scrollHeight
    }
    console.log('after', document.querySelector('#mainSvg').viewBox.baseVal.height)
}

export default function displayNewSegment() {
  const start = getSegmentAttribute('startMS') / SMALL_FACTOR
  const end = getSegmentAttribute('endMS') / SMALL_FACTOR
  const ratio = getConfigState('ratio1pxToMS')
  const roundTripTimeMS = getConfigState('roundTripTimeMS') / SMALL_FACTOR
  const seqNum = getSegmentAttribute('seqNum')
  const isDelivered = getSegmentAttribute('isDelivered')
  

  adaptSvgSize(end, roundTripTimeMS)
  
  const colorFill = getSegmentAttribute('retransmitted') ? 'pink' : 'none'
  const colorStroke = getSegmentAttribute('retransmitted') ? 'pink' : 'black'
  if (isDelivered) {
    const newPacket = document.createElementNS(NAME_SPACE_URI, 'path')
    newPacket.setAttribute('stroke', colorStroke)
    newPacket.setAttribute('stroke-width', '0.1')
    newPacket.setAttribute('fill', colorFill)
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
        ' Z',
    )

    newPacket.setAttribute('id', start + '!' + seqNum)

    const newPacketTextPath = document.createElementNS(
      NAME_SPACE_URI,
      'textPath',
    )
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
        (end - roundTripTimeMS / 4) * ratio +
        ' ' +
        'L90 ' +
        (end - roundTripTimeMS / 2) * ratio +
        'L90 ' +
        start * ratio +
        'L50 ' +
        (start + roundTripTimeMS / 4) * ratio +
        ' Z',
    )
    newPacket.setAttribute('id', start + '!' + seqNum)

    const newPacketTextPath = document.createElementNS(
      NAME_SPACE_URI,
      'textPath',
    )
    newPacketTextPath.setAttribute('href', '#' + start + '!' + seqNum)
    newPacketTextPath.setAttribute('startOffset', '21%')
    newPacketTextPath.innerHTML = 'Seq-Nr: ' + seqNum

    const newPacketText = document.createElementNS(NAME_SPACE_URI, 'text')
    newPacketText.append(newPacketTextPath)

    document.querySelector('#tcpSegments').append(newPacket)
    document.querySelector('#tcpSegments').append(newPacketText)
  }
}
