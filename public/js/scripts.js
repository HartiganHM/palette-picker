const colorsArray = [
  { class: '.color-1', hexValue: '000000', locked: false },
  { class: '.color-2', hexValue: '000000', locked: false },
  { class: '.color-3', hexValue: '000000', locked: false },
  { class: '.color-4', hexValue: '000000', locked: false },
  { class: '.color-5', hexValue: '000000', locked: false }
];

const generateColors = (colorArray) => {
  const hexidecimalValues = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    'A',
    'B',
    'C',
    'D',
    'E',
    'F'
  ];

  const colorValues = colorsArray.map(color => {
    const hexValue = color.hexValue
      .split('')
      .map(element => {
        const randomValue = Math.floor(Math.random() * 16);
        return hexidecimalValues[randomValue];
      })
      .join('');

      if (!color.locked) {
        color.value = `#${hexValue}`;
      }

    return color;
  });

  applyColors(colorValues);
};

const applyColors = colorValues => {
  colorValues.forEach(color => {
    $(`${color.class}`).css('background-color', [color.value]);
    $(`${color.class}`).children()[1].innerText = `${color.value}`;
  });
};

const toggleLockIcon = event => {
  const element = event.target;
  let locked;

  if ($(element).hasClass('icon-lock-open')) {
    $(element)
      .removeClass('icon-lock-open')
      .addClass('icon-lock-closed');
      locked = true;
  } else {
    $(element)
      .removeClass('icon-lock-closed')
      .addClass('icon-lock-open');
      locked = false;
  }

  toggleColorLock(event, colorsArray, locked)
};

const toggleColorLock = (event, array, locked) => {
  const parentColorClass = '.' + $(event.target).parent()[0].classList[1];
  array.map(color => {
    if (color.class === parentColorClass) {
      color.locked = locked
    }
    return color;
  })
}

$(document).ready(generateColors(colorsArray));
$(document).on('keydown', (event) => {
  if (event.keyCode === 32 && event.target === document.body) {
    event.preventDefault();
    generateColors();
  }
});
$('.generate-palette-button').click((colorsArray) => generateColors(colorsArray));
$('.lock').on('click', event => toggleLockIcon(event));
