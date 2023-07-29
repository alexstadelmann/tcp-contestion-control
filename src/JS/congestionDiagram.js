import { NAME_SPACE_URI } from '@/JS/tcpMetaVisual'
import { getServerState } from '@/JS/session'

const X_AXIS_PADDING = 5
const Y_AXIS_PADDING = 10
const Y_AXIS_STEP = 10
const X_AXIS_STEP = 5

export default function renderCongestionDiagram() {
  //Add x axis numbers
  let number = 1
  const viewBoxWidth =
    document.querySelector('#diagramSvg').viewBox.baseVal.width
  let viewBoxUnitIterator = X_AXIS_PADDING
  while (viewBoxUnitIterator < viewBoxWidth) {
    const newNumberOnXAxis = document.createElementNS(NAME_SPACE_URI, 'text')
    newNumberOnXAxis.setAttribute('y', '95%')
    newNumberOnXAxis.setAttribute('x', viewBoxUnitIterator)
    newNumberOnXAxis.setAttribute('text-anchor', 'middle')
    newNumberOnXAxis.innerHTML = number
    document.querySelector('#diagramSvg').append(newNumberOnXAxis)
    number += 1
    viewBoxUnitIterator += X_AXIS_STEP
  }

  //Add y axis numbers
  number = 0
  const viewBoxHeight =
    document.querySelector('#diagramSvg').viewBox.baseVal.height
  viewBoxUnitIterator = 0.91 * viewBoxHeight
  while (viewBoxUnitIterator > 0) {
    const newNumberOnXAxis = document.createElementNS(NAME_SPACE_URI, 'text')
    newNumberOnXAxis.setAttribute('x', '3%')
    newNumberOnXAxis.setAttribute('y', viewBoxUnitIterator)
    newNumberOnXAxis.setAttribute('text-anchor', 'middle')
    newNumberOnXAxis.innerHTML = number
    document.querySelector('#axisNumbers').append(newNumberOnXAxis)
    number += 5
    viewBoxUnitIterator -= Y_AXIS_STEP
  }
}

export function addPointToCongestionDiagram() {
  const [round, roundCongWin] = getServerState('roundCongWin')
  const xCoordinate = round * X_AXIS_STEP
  const yCoordinate = 100 - Y_AXIS_PADDING - roundCongWin * 2
  const svgPoint = document.createElementNS(NAME_SPACE_URI, 'circle')
  svgPoint.setAttribute('cx', xCoordinate)
  svgPoint.setAttribute('cy', yCoordinate)
  svgPoint.setAttribute('r', 0.8)
  svgPoint.setAttribute('color', 'blue')
  svgPoint.setAttribute('fill', 'blue')
  svgPoint.setAttribute('stroke-width', 3)
  document.querySelector('#dataPoints').append(svgPoint)
}
