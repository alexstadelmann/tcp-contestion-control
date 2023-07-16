const NAME_SPACE_URI = 'http://www.w3.org/2000/svg'

document.addEventListener('DOMContentLoaded', () => {
  //Add x axis numbers
  let number = 1
  const viewBoxWidth =
    document.querySelector('#diagramSvg').viewBox.baseVal.width
  let viewBoxUnitIterator = 5
  while (viewBoxUnitIterator < viewBoxWidth) {
    const newNumberOnXAxis = document.createElementNS(NAME_SPACE_URI, 'text')
    newNumberOnXAxis.setAttribute('y', '95%')
    newNumberOnXAxis.setAttribute('x', viewBoxUnitIterator)
    newNumberOnXAxis.setAttribute('text-anchor', 'middle')
    newNumberOnXAxis.innerHTML = number
    document.querySelector('#axisNumbers').append(newNumberOnXAxis)
    number += 1
    viewBoxUnitIterator += 9
  }

  //Add y axis numbers
  number = 1
  const viewBoxHeight =
    document.querySelector('#diagramSvg').viewBox.baseVal.height
  viewBoxUnitIterator = 0.9 * viewBoxHeight
  while (viewBoxUnitIterator > 0) {
    const newNumberOnXAxis = document.createElementNS(NAME_SPACE_URI, 'text')
    newNumberOnXAxis.setAttribute('x', '3%')
    newNumberOnXAxis.setAttribute('y', viewBoxUnitIterator)
    newNumberOnXAxis.setAttribute('text-anchor', 'middle')
    newNumberOnXAxis.innerHTML = number
    document.querySelector('#axisNumbers').append(newNumberOnXAxis)
    number += 1
    viewBoxUnitIterator -= 5
  }
})
