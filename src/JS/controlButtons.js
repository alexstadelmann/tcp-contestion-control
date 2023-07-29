import displayNewSegment from '@/JS/nextSegmentVisual'
import resendMissingSegment from '@/JS/resendSegmentAfterTimeout'
import resendMissingSegment3Dup from '@/JS/resendSegmentAfter3Dup'
import { nextPacket } from '@/JS/nextPacketCoordinator'
import {
  establishTcp,
  deactivateAllButtons,
  finalizeSession,
} from '@/JS/tcpMetaLogic'
import { clientReceiveSegment } from '@/JS/nextSegmentLogic'
import { getServerState, algorithms } from '@/JS/session'
import { clientSendNewAck, serverReceiveNewAck } from '@/JS/nextAckLogic'
import displayNewAck from '@/JS/nextAckVisual'

export const sendPacket = () => {
  let algorithm = getServerState('ccState')
  switch (algorithm) {
    case algorithms.SLOW_START:
      nextPacket(true)
      break
    case algorithms.TIMEOUT:
      resendMissingSegment(true)
      clientReceiveSegment()
      displayNewSegment()
      break
    case algorithms.DUP_3:
      resendMissingSegment3Dup(true)
      clientReceiveSegment()
      displayNewSegment()
      break
    case algorithms.CONGESTION_AVOIDANCE:
      nextPacket(true)
      break
    case algorithms.FAST_RECOVERY:
      nextPacket(true)
  }
}

export const endTcp = () => {
  if (getServerState('confirmedReceived') != getServerState('seqNum')) {
    clientSendNewAck(true)
    serverReceiveNewAck()
    displayNewAck()
  } else {
    finalizeSession()
  }
  deactivateAllButtons()
  document.querySelector('#tcpEnd').removeAttribute('disabled')
}

export function setActiveButtons() {
  document.querySelectorAll('#press button').forEach((button) => {
    button.setAttribute('disabled', '')
  })
  document.querySelector('#startButton').removeAttribute('disabled')
}

export const registerControlButtonsEvents = () => {
  document.querySelector('#send').addEventListener('click', sendPacket)
  document.querySelector('#loss').addEventListener('click', () => {
    let algorithm = getServerState('ccState')
    switch (algorithm) {
      case algorithms.SLOW_START:
        nextPacket(false)
        break
      case algorithms.TIMEOUT:
        resendMissingSegment(false)
        displayNewSegment()
        break
      case algorithms.DUP_3:
        resendMissingSegment3Dup(true)
        clientReceiveSegment()
        displayNewSegment()
        break
      case algorithms.CONGESTION_AVOIDANCE:
        nextPacket(false)
        break
      case algorithms.FAST_RECOVERY:
        nextPacket(false)
    }
  })
  document.querySelector('#startButton').addEventListener('click', establishTcp)
  document.querySelector('#tcpEnd').addEventListener('click', endTcp)
}
