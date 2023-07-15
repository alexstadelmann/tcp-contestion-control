import updateDataPanel from './parameterDisplay'
import { addToClockMs } from './tcpMetaLogic'
import { displayFirstUnAckedBar } from './seqDiagramFeaturesVisual'
import { setTimestampFirstUnacked } from './nextPacketCoordinator'
import {
  events,
  algorithms,
  serverSegments,
  getServerState,
  getConfigState,
  setServerState,
  setSessionState,
  getSegmentAttribute,
} from './session'

export default function resendMissingSegment(isDelivered) {
  const firstUnackedSegmentNum = getServerState('firstUnackedSegmentNum')

  const lostSegment = serverSegments[firstUnackedSegmentNum]

  const retransmissionSegment = {
    isDelivered,
    startMS:
      lostSegment.sendingCompleteMS +
      getConfigState('timeoutSpan') * getConfigState('roundTripTimeMS'),
    endMS:
      lostSegment.endMS +
      getConfigState('timeoutSpan') * getConfigState('roundTripTimeMS') +
      lostSegment.transmissionTime,
    sendingCompleteMS:
      lostSegment.sendingCompleteMS +
      getConfigState('timeoutSpan') * getConfigState('roundTripTimeMS') +
      lostSegment.transmissionTime,
    seqNum: lostSegment.seqNum,
    retransmitted: true,
    transmissionTime: lostSegment.transmissionTime,
  }
  serverSegments.push(retransmissionSegment)

  setServerState({
    ccState: algorithms.SLOW_START,
    currentTraffic: getServerState('currentTraffic') + 1,
    firstUnackedSegmentNum: firstUnackedSegmentNum + 1,
  })

  //Update clock
  addToClockMs(lostSegment.transmissionTime)

  //If currently all segments are acked, then set the sending end of the new ack to be the timeout timer start
  setTimestampFirstUnacked(getSegmentAttribute('sendingCompleteMS'))

  //If sending this segment fails, it is the "resposibility" of the server to inform the session
  if (!isDelivered) {
    setSessionState({
      lastEvent: events.RETRANSMIT_LOSS,
    })
  }
  updateDataPanel()
  displayFirstUnAckedBar()
}
