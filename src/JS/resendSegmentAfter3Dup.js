import updateDataPanel from './parameterDisplay'
import { setTimestampFirstUnacked } from './nextPacketCoordinator'
import {
  events,
  algorithms,
  getServerState,
  setServerState,
  serverSegments,
  getConfigState,
  setSessionState,
  getSessionState,
  getSegmentAttribute,
} from './session'

export default function resendMissingSegment3Dup(isDelivered) {
  const firstUnackedSegmentNum = getServerState('firstUnackedSegmentNum')

  const lostSegment = serverSegments[firstUnackedSegmentNum]

  const transmissionTime = lostSegment.transmissionTime
  const seqNum = lostSegment.seqNum
  const startMS = getSessionState('clockMS')
  const roundTripTimeMS = getConfigState('roundTripTimeMS')

  const retransmissionSegment = {
    isDelivered,
    startMS,
    seqNum,
    transmissionTime,
    endMS: startMS + transmissionTime + roundTripTimeMS / 2,
    sendingCompleteMS: startMS + transmissionTime,
    retransmitted: true,
  }
  serverSegments.push(retransmissionSegment)
  setServerState({
    ccState: algorithms.FAST_RECOVERY,
    currentTraffic: getServerState('currentTraffic') + 1,
    firstUnackedSegmentNum: firstUnackedSegmentNum + 1,
  })

  //Update clock
  setSessionState({
    clockMS: getSessionState('clockMS') + transmissionTime,
  })

  //If currently all segments are acked, then set the sending end of the new ack to be the timeout timer start
  setTimestampFirstUnacked(getSegmentAttribute('sendingCompleteMS'))

  //If sending this segment fails, it is the "resposibility" of the server to inform the session
  if (!isDelivered) {
    setSessionState({
      lastEvent: events.RETRANSMIT_LOSS,
    })
  }
  updateDataPanel()
}
