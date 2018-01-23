let colorsArray = [
  { class: 'color-1', hexValue: '000000', locked: false },
  { class: 'color-2', hexValue: '000000', locked: false },
  { class: 'color-3', hexValue: '000000', locked: false },
  { class: 'color-4', hexValue: '000000', locked: false },
  { class: 'color-5', hexValue: '000000', locked: false }
]

const generateColors = (colorsArray) => {
  const hexidecimalValues = [ 'A', 'B', 'C', 'D', 'E', 'F', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
  const colorValues = colorsArray.map(color => {
    const hexValue = color.value.split('').map(element => {
      const randomValue = Math.floor(Math.random() * 16)
      return hexidecimalValues[randomValue]
    }).join('')

    color.value = `#${hexValue}`
    return color;
  })
  return colorsArray;
}

$(document).ready(generateColors(colorsArray));
