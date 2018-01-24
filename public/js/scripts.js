const colorsArray = [
  {
    class: '.color-1',
    hexValue: '000000',
    brightnessValue: '#FFF',
    locked: false
  },
  {
    class: '.color-2',
    hexValue: '000000',
    brightnessValue: '#FFF',
    locked: false
  },
  {
    class: '.color-3',
    hexValue: '000000',
    brightnessValue: '#FFF',
    locked: false
  },
  {
    class: '.color-4',
    hexValue: '000000',
    brightnessValue: '#FFF',
    locked: false
  },
  {
    class: '.color-5',
    hexValue: '000000',
    brightnessValue: '#FFF',
    locked: false
  }
];

const savedProjects = {};

const generateColors = colorArray => {
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
    let brightnessValue = 0;
    const hexValue = color.hexValue
      .split('')
      .map((element, index) => {
        const randomValue = Math.floor(Math.random() * 16);
        if (index === 0 || index === 2 || index === 4) {
          brightnessValue += randomValue;
        }
        return hexidecimalValues[randomValue];
      })
      .join('');

    brightnessValue <= 19
      ? (brightnessValue = '#FFF')
      : (brightnessValue = '#000');

    if (!color.locked) {
      color.value = `#${hexValue}`;
      color.brightnessValue = brightnessValue;
    }

    return color;
  });

  applyColors(colorValues);
};

const applyColors = colorValues => {
  colorValues.forEach(color => {
    const colorText = $(`${color.class}`).children()[1];
    const icon = $(`${color.class}`).children()[0];

    $(`${color.class}`).css('background-color', [color.value]);
    colorText.innerText = `${color.value}`;
    $(colorText).css('color', [color.brightnessValue]);
    $(icon).css('color', [color.brightnessValue]);
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

  toggleColorLock(event, colorsArray, locked);
};

const toggleColorLock = (event, array, locked) => {
  const parentColorClass = '.' + $(event.target).parent()[0].classList[1];
  array.map(color => {
    if (color.class === parentColorClass) {
      color.locked = locked;
    }
    return color;
  });
};

const inputCheck = event => {
  event.preventDefault();
  const input = $(event.target).siblings()[0];

  input.value === ''
    ? $(input).attr('placeholder', 'Please enter a title')
    : createNewProject(input);
};

const createNewProject = title => {
  const projectList = Object.keys(savedProjects);

  if (projectList.length === 0) {
    renderProject(title.value);
  }

  savedProjects[title.value] = {};
  renderProjectDropdown(title.value);
  title.value = '';
};

const renderProject = title => {
  $('.project-container').prepend(
    `
      <div class="project">
        <span class="project-name">${title}</span>

        <span class="project-palette palette-placeholder">
        <span class="palette-name">No palettes</span>

        <span class="palette-color-group">
          <div class="saved-color"></div>
          <div class="saved-color"></div>
          <div class="saved-color"></div>
          <div class="saved-color"></div>
          <div class="saved-color"></div>
        </span>

        <i class="icon-trash trash-placeholder" disabled></i>
      </span>
      </div>
    `
  );
};

const renderProjectDropdown = project => {
  $('.dropdown-placeholder').remove();

  $('.project-selection').append(`
      <span class="dropdown-item">${project}</span>
    `);
};

const toggleProjects = () => {
  $('.project-selection').toggleClass('hidden');
};

const selectProject = event => {
  const dropdownItem = $(event.target).closest('.dropdown-item');

  if (!dropdownItem[0]) {
    return;

  } else if ($(dropdownItem)[0].innerText === 'No Projects') {
    toggleProjects();

  } else if ($(dropdownItem)[0].innerText) {
    toggleProjects();
    $('.project').remove();
    renderProject($(dropdownItem)[0].innerText);
  }
};

$(document).ready(generateColors(colorsArray));
$(document).on('keydown', event => {
  if (event.keyCode === 32 && event.target === document.body) {
    event.preventDefault();
    generateColors();
  }
});
$('.generate-palette-button').click(colorsArray => generateColors(colorsArray));
$('.lock').on('click', event => toggleLockIcon(event));
$('.save-project-button').click(event => inputCheck(event));
$('.project-dropdown').click(toggleProjects);
$('.dropdown-wrapper').click(event => selectProject(event));
