import { establishTcp } from '@/JS/tcpMetaLogic'
import { endTcp, sendPacket } from './controlButtons'

const { end, next, start } = {
  start: establishTcp,
  next: sendPacket,
  end: endTcp,
}

const sequences = {
  classic: [
    {
      run: start,
      repeat: 4,
    },
    {
      run: next,
      repeat: 77,
    },
    {
      run: end,
      repeat: 18,
    },
  ],
  tcpMeta: [
    {
      run: start,
      repeat: 4,
    },
    {
      run: end,
      repeat: 4,
    },
  ],
}

let i = 0
const runSequence = (sequenceActions, delaySeconds = 0.5) => {
  const msTimeout = delaySeconds * 1000
  setTimeout(() => {
    const currentAction = sequenceActions[i]

    if (currentAction.repeat > 0) {
      currentAction.run()
      currentAction.repeat--
    }

    if (currentAction.repeat === 0) {
      if (i < sequenceActions.length - 1) i++
      else return
    }

    runSequence(sequenceActions)
  }, msTimeout)
}

const registerDemoSequenceEvents = () => {
  document
    .querySelector('button#runClassicDemoSequence')
    .addEventListener('click', () => runSequence(sequences.classic))

  document
    .querySelector('button#runTcpMetaDemoSequence')
    .addEventListener('click', () => runSequence(sequences.tcpMeta))
}

export default registerDemoSequenceEvents
