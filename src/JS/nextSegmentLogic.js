import updateDataPanel from '@/JS/parameterDisplay'
import { addToClockMs } from '@/JS/tcpMetaLogic'
import { setTimestampFirstUnacked } from '@/JS/nextPacketCoordinator'
import {
  NONE,
  events,
  pendingAcks,
  clientBuffer,
  setClientState,
  getClientState,
  serverSegments,
  getServerState,
  setServerState,
  getConfigState,
  setSessionState,
  getSessionState,
  getSegmentAttribute,
} from '@/JS/session'

export function serverSendSegment(isDelivered) {
  //Fetch up to date parameters
  const now = getSessionState('clockMS')
  const seqNum = getServerState('seqNum')
  const currentTraffic = getServerState('currentTraffic')

  const segSizeByte = getConfigState('segSizeByte')
  const roundTripTimeMS = getConfigState('roundTripTimeMS')
  const transrateKBytePerSecond = getConfigState('transrateKBytePerSecond')

  //Compute new parameters
  const sendingCompleteMS = now + segSizeByte / transrateKBytePerSecond
  const delayMS = segSizeByte / transrateKBytePerSecond + roundTripTimeMS / 2
  const transmissionTime = segSizeByte / transrateKBytePerSecond

  //Update clock
  console.log('transtime', transmissionTime)
  setSessionState({
    clockMS: getSessionState('clockMS') + transmissionTime,
  })

  console.log(getSessionState('clockMS'))
  //Make new segment
  const newSegment = {
    startMS: now,
    endMS: now + delayMS,
    sendingCompleteMS,
    seqNum,
    isDelivered,
    transmissionTime,
    retransmitted: false,
  }

  serverSegments.push(newSegment)

  //Update server state to reflect sending a new segment
  setServerState({
    seqNum: seqNum + segSizeByte,
    currentTraffic: currentTraffic + 1,
  })

  //If currently all segments are acked, then set the sending end of the new ack to be the timeout timer start
  if (getServerState('timestampFirstUnacked') == NONE) {
    setTimestampFirstUnacked(sendingCompleteMS)
  }

  //If sending this segment fails, it is the "resposibility" of the server to inform the session
  if (!isDelivered) {
    setSessionState({
      lastEvent: events.SEG_LOSS,
    })
  }
}

export function clientReceiveSegment() {
  const roundTripTimeMS = getConfigState('roundTripTimeMS')
  //We know that the segment has arrived
  setSessionState({
    lastEvent: events.SEG,
  })
  updateDataPanel()

  //Add new segment to client buffer
  clientBuffer.add(getSegmentAttribute('seqNum'))

  //Check if there is a or many segments already in buffer that fit after the received segment
  // unexpected
  while (true) {
    if (clientBuffer.has(getClientState('BytesReceivedInOrder'))) {
      setClientState({
        BytesReceivedInOrder:
          getClientState('BytesReceivedInOrder') +
          getConfigState('segSizeByte'),
      })
    } else {
      break
    }
  }

  //Create the acknowlegement for the new segment
  const newAck = {
    startMS: getSegmentAttribute('endMS'),
    endMS: getSegmentAttribute('endMS') + roundTripTimeMS / 2,
    ackNum: getClientState('BytesReceivedInOrder'),
    sendingSegmentCompleteMS: getSegmentAttribute('sendingCompleteMS'),
  }
  pendingAcks.unshift(newAck)
}
