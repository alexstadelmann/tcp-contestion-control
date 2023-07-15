document.addEventListener('DOMContentLoaded', () => {
  //Add x axis numbers
  let number = 1
  const viewBoxWidth =
    document.querySelector('#diagramSvg').viewBox.baseVal.width
  console.log(viewBoxWidth)
  let viewBoxUnitIterator = 5
  while (viewBoxUnitIterator < viewBoxWidth) {
    const newNumberOnXAxis = document.createElementNS(NAME_SPACE_URI, 'text')
    newNumberOnXAxis.setAttribute('y', '95%')
    newNumberOnXAxis.setAttribute('x', viewBoxUnitIterator)
    newNumberOnXAxis.setAttribute('text-anchor', 'middle')
    newNumberOnXAxis.innerHTML = number
    document.querySelector('#axisNumbers').append(newNumberOnXAxis)
    console.log(newNumberOnXAxis)
    number += 1
    viewBoxUnitIterator += 9
  }

  //Add y axis numbers
  number = 1
  const viewBoxHeight =
    document.querySelector('#diagramSvg').viewBox.baseVal.height
  console.log(viewBoxWidth)
  viewBoxUnitIterator = 0.9 * viewBoxHeight
  while (viewBoxUnitIterator > 0) {
    const newNumberOnXAxis = document.createElementNS(NAME_SPACE_URI, 'text')
    newNumberOnXAxis.setAttribute('x', '3%')
    newNumberOnXAxis.setAttribute('y', viewBoxUnitIterator)
    newNumberOnXAxis.setAttribute('text-anchor', 'middle')
    newNumberOnXAxis.innerHTML = number
    document.querySelector('#axisNumbers').append(newNumberOnXAxis)
    console.log(newNumberOnXAxis)
    number += 1
    viewBoxUnitIterator -= 5
  }
})
