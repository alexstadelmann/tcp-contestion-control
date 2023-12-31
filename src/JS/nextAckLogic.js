import updateDataPanel from '@/JS/parameterDisplay'
import { addPointToCongestionDiagram } from '@/JS/congestionDiagram'

import {
  NONE,
  events,
  algorithms,
  clientAcks,
  getLastElem,
  pendingAcks,
  serverSegments,
  getServerState,
  getConfigState,
  setServerState,
  setSessionState,
  getSessionState,
} from '@/JS/session'

export function clientSendNewAck(isDelivered) {
  //Fetch ack from pending array and also parameters
  const newAck = getLastElem(pendingAcks)

  //Set property delivered to true or false
  newAck.isDelivered = isDelivered

  //Send new ack by pushing it onto the (realality-emulating) client array
  clientAcks.push(newAck)

  //If the ack gets lost it is this functions responsibility to tell the session
  if (!isDelivered) {
    setSessionState({
      lastEvent: events.ACK_LOSS,
    })
  }
}

function trigger3duplicateAcksEvent() {
  setServerState({
    ccState: algorithms.DUP_3,
    threshold: Math.max(2, Math.floor(getServerState('congWin') / 2)),
    congWin: Math.floor(getServerState('congWin') / 2) + 3,
    congWinFractions: 0,
  })
  setSessionState({
    lastEvent: events.DUP_3,
  })

  updateDataPanel()
}

function triggerThresholdEvent() {
  let algorithm = getServerState('ccState')
  switch (algorithm) {
    case algorithms.SLOW_START:
      setServerState({
        ccState: algorithms.CONGESTION_AVOIDANCE,
      })
      setSessionState({
        lastEvent: events.THRESHOLD_REACHED,
      })
      break
    case algorithms.FAST_RECOVERY:
      setServerState({
        ccState: algorithms.SLOW_START,
      })
      setSessionState({
        lastEvent: events.TIMEOUT,
      })
      break
  }
}

export function serverReceiveNewAck() {
  const newAck = getLastElem(pendingAcks)
  const ackNum = newAck.ackNum

  const congWin = getServerState('congWin')
  const currentTraffic = getServerState('currentTraffic')
  const duplicateAcks = getServerState('duplicateAcks')
  let firstUnackedSegmentNum = getServerState('firstUnackedSegmentNum')

  const segSizeByte = getConfigState('segSizeByte')

  //Check of a new round beginns
  if (newAck.ackNum >= getServerState('firstOfRoundSeq') + segSizeByte) {
    setServerState({
      roundCongWin: [getServerState('round'), getServerState('congWin')],
    })
    addPointToCongestionDiagram()
    setServerState({
      firstOfRoundSeq: getServerState('seqNum'),
      round: getServerState('round') + 1,
    })
  }
  setServerState({
    currentTraffic: currentTraffic - 1,
  })

  

  if (newAck.endMS > getSessionState('clockMS')) {
    setSessionState({
      clockMS: newAck.endMS,
    })
  }
  setSessionState({
    lastEvent: events.NEW_ACK,
  })

  //Check is ack is a duplicate
  if (ackNum == getServerState('confirmedReceived')) {
    setSessionState({
      lastEvent: events.DUP_ACK,
    })
    if (getServerState('ccState') != algorithms.FAST_RECOVERY) {
      setServerState({
        duplicateAcks: duplicateAcks + 1,
      })

      if (getServerState('duplicateAcks') >= 3) {
        trigger3duplicateAcksEvent()
        return
      }
    } else {
      setServerState({
        congWin: getServerState('congWin') + 1,
      })
    }
  } else {
    //Here we know that ack is not duplicate
    switch (getServerState('ccState')) {
      case algorithms.SLOW_START:
        setServerState({
          congWin: getServerState('congWin') + 1,
          confirmedReceived: ackNum,
        })
        //Check if threshold has been reached
        if (getServerState('congWin') >= getServerState('threshold')) {
          triggerThresholdEvent()
          return
        }
        //If the ack acknowledges the first currentTraffic segment send or even a later segment, then update server state
        if (
          ackNum >=
          serverSegments[firstUnackedSegmentNum].seqNum + segSizeByte
        ) {
          const numberOfSteps =
            (ackNum - serverSegments[firstUnackedSegmentNum].seqNum) /
            segSizeByte
          firstUnackedSegmentNum += numberOfSteps
          const timestampFirstUnacked =
            serverSegments.length <= firstUnackedSegmentNum
              ? NONE
              : serverSegments[firstUnackedSegmentNum].sendingCompleteMS

          setServerState({
            firstUnackedSegmentNum,
            timestampFirstUnacked,
          })
        }
        break
      case algorithms.CONGESTION_AVOIDANCE:
        setServerState({
          congWinFractions: getServerState('congWinFractions') + 1,
          currentTraffic: currentTraffic - 1,
          confirmedReceived: ackNum,
        })
        if (getServerState('congWinFractions') == congWin) {
          setServerState({
            congWin: congWin + 1,
            congWinFractions: 0,
          })
        }
        //If the ack acknowledges the first currentTraffic segment send or even a later segment, then update server state
        if (
          ackNum >=
          serverSegments[firstUnackedSegmentNum].seqNum + segSizeByte
        ) {
          const numberOfSteps =
            (ackNum - serverSegments[firstUnackedSegmentNum].seqNum) /
            segSizeByte
          firstUnackedSegmentNum += numberOfSteps
          const timestampFirstUnacked =
            serverSegments.length <= firstUnackedSegmentNum
              ? NONE
              : serverSegments[firstUnackedSegmentNum].sendingCompleteMS

          setServerState({
            firstUnackedSegmentNum,
            timestampFirstUnacked,
          })
        }
        break
      case algorithms.FAST_RECOVERY:
        setServerState({
          ccState: algorithms.CONGESTION_AVOIDANCE,
          congWin: getServerState('threshold'),
          duplicateAcks: 0,
        })
        setSessionState({
          lastEvent: events.NEW_ACK,
        })
    }
  }
}
